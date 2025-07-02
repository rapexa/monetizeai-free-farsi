package services

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"monetizeai-backend/config"
	"net/http"
	"sync"
	"time"
)

type ippanelPatternRequest struct {
	SendingType string            `json:"sending_type"`
	FromNumber  string            `json:"from_number"`
	Code        string            `json:"code"`
	Recipients  []string          `json:"recipients"`
	Params      map[string]string `json:"params"`
}

type ippanelLoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type ippanelLoginResponse struct {
	Data struct {
		Token string `json:"token"`
	} `json:"data"`
	Meta struct {
		Status  bool   `json:"status"`
		Message string `json:"message"`
	} `json:"meta"`
}

var (
	tokenCache     string
	tokenCacheTime time.Time
	tokenMutex     sync.Mutex
)

// Set your ippanel username and password here or load from config if needed
const ippanelUsername = "FREE09103946748"
const ippanelPassword = "RSk$k7%CDH9s@KIms<>Ro7E"

func getIppanelToken(baseURL string) (string, error) {
	tokenMutex.Lock()
	defer tokenMutex.Unlock()
	if tokenCache != "" && time.Since(tokenCacheTime) < 50*time.Minute {
		return tokenCache, nil
	}
	loginReq := ippanelLoginRequest{
		Username: ippanelUsername,
		Password: ippanelPassword,
	}
	jsonBody, _ := json.Marshal(loginReq)
	resp, err := http.Post(baseURL+"/api/acl/auth/login", "application/json", bytes.NewBuffer(jsonBody))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	respBody, _ := ioutil.ReadAll(resp.Body)
	var loginResp ippanelLoginResponse
	if err := json.Unmarshal(respBody, &loginResp); err != nil {
		return "", err
	}
	if !loginResp.Meta.Status || loginResp.Data.Token == "" {
		return "", err
	}
	tokenCache = loginResp.Data.Token
	tokenCacheTime = time.Now()
	return tokenCache, nil
}

func SendSMS(phone string, params map[string]string, patternKey string) error {
	fromNumber := config.Config.FromNumber
	patternCode := config.Config.Patterns[patternKey]
	baseURL := config.Config.SMSBaseURL

	if baseURL == "" {
		log.Printf("[SMS] ERROR: baseURL is empty in config!")
		return nil
	}

	token, err := getIppanelToken(baseURL)
	if err != nil {
		log.Printf("[SMS] Failed to get token: %v", err)
		return err
	}

	body := ippanelPatternRequest{
		SendingType: "pattern",
		FromNumber:  fromNumber,
		Code:        patternCode,
		Recipients:  []string{phone},
		Params:      params,
	}

	jsonBody, err := json.Marshal(body)
	if err != nil {
		log.Printf("[SMS] Failed to marshal request: %v", err)
		return err
	}

	requestURL := baseURL + "/api/send"
	log.Printf("[SMS] Sending to URL: %s", requestURL)
	log.Printf("[SMS] Request body: %s", string(jsonBody))

	req, err := http.NewRequest("POST", requestURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		log.Printf("[SMS] Failed to create request: %v", err)
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", token)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Printf("[SMS] Request failed: %v", err)
		return err
	}
	defer resp.Body.Close()

	respBody, _ := ioutil.ReadAll(resp.Body)
	log.Printf("[SMS] Response body: %s", string(respBody))

	if resp.StatusCode == 401 {
		// Token might be expired, try to re-authenticate once
		tokenCache = ""
		token, err = getIppanelToken(baseURL)
		if err == nil && token != "" {
			req.Header.Set("Authorization", token)
			resp, err = http.DefaultClient.Do(req)
			if err == nil {
				respBody, _ = ioutil.ReadAll(resp.Body)
				log.Printf("[SMS] Response body: %s", string(respBody))
			}
		}
	}

	if resp.StatusCode != 200 {
		log.Printf("[SMS] Non-200 response: %d", resp.StatusCode)
		return err
	}

	log.Printf("[SMS] Sent to %s: %+v (pattern: %s)", phone, params, patternKey)
	return nil
}
