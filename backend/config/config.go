package config

import (
	"github.com/spf13/viper"
	"log"
)

type DBConfig struct {
	User     string
	Password string
	Host     string
	Port     int
	Name     string
}

type AppConfig struct {
	DB DBConfig
	SMSApiKey string
	FromNumber string
	SMSBaseURL string
	Patterns map[string]string
}

var Config AppConfig

func LoadConfig() {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AddConfigPath("./config")

	err := viper.ReadInConfig()
	if err != nil {
		log.Fatalf("Error reading config file: %v", err)
	}

	err = viper.Unmarshal(&Config)
	if err != nil {
		log.Fatalf("Unable to decode into struct: %v", err)
	}
}

// Placeholder for configuration logic (e.g., loading env variables) 