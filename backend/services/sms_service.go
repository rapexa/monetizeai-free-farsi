package services

import (
	"bytes"
	"encoding/json"
	"log"
	"monetizeai-backend/config"
	"net/http"
)

type ippanelRequest struct {
	SendingType string            `json:"sending_type"`
	FromNumber  string            `json:"from_number"`
	Code        string            `json:"code"`
	Recipients  []string          `json:"recipients"`
	Params      map[string]string `json:"params"`
}

func SendSMS(phone string, params map[string]string, patternKey string) error {
	apiKey := config.Config.SMSApiKey
	fromNumber := config.Config.FromNumber
	patternCode := config.Config.Patterns[patternKey]
	baseURL := config.Config.SMSBaseURL

	body := ippanelRequest{
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

	req, err := http.NewRequest("POST", baseURL+"/api/send", bytes.NewBuffer(jsonBody))
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

	if resp.StatusCode != 200 {
		log.Printf("[SMS] Non-200 response: %d", resp.StatusCode)
		return err
	}

	log.Printf("[SMS] Sent to %s: %+v (pattern: %s)", phone, params, patternKey)
	return nil
}
