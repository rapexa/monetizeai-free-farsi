package services

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"monetizeai-backend/config"
	"net/http"
)

type ippanelPatternRequest struct {
	Code      string            `json:"code"`
	Sender    string            `json:"sender"`
	Recipient string            `json:"recipient"`
	Variable  map[string]string `json:"variable"`
}

func SendSMS(phone string, params map[string]string, patternKey string) error {
	apiKey := config.Config.SMSApiKey
	fromNumber := config.Config.FromNumber
	patternCode := config.Config.Patterns[patternKey]
	baseURL := config.Config.SMSBaseURL

	if baseURL == "" {
		log.Printf("[SMS] ERROR: baseURL is empty in config!")
		return nil
	}

	body := ippanelPatternRequest{
		Code:      patternCode,
		Sender:    fromNumber,
		Recipient: phone,
		Variable:  params,
	}

	jsonBody, err := json.Marshal(body)
	if err != nil {
		log.Printf("[SMS] Failed to marshal request: %v", err)
		return err
	}

	requestURL := baseURL + "/sms/pattern/normal/send"
	log.Printf("[SMS] Sending to URL: %s", requestURL)
	log.Printf("[SMS] Request body: %s", string(jsonBody))

	req, err := http.NewRequest("POST", requestURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		log.Printf("[SMS] Failed to create request: %v", err)
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", apiKey)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Printf("[SMS] Request failed: %v", err)
		return err
	}
	defer resp.Body.Close()

	respBody, _ := ioutil.ReadAll(resp.Body)

	if resp.StatusCode != 200 {
		log.Printf("[SMS] Non-200 response: %d", resp.StatusCode)
		log.Printf("[SMS] Response body: %s", string(respBody))
		return err
	}

	log.Printf("[SMS] Sent to %s: %+v (pattern: %s)", phone, params, patternKey)
	log.Printf("[SMS] Response body: %s", string(respBody))
	return nil
}
