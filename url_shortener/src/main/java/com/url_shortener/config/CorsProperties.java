package com.url_shortener.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "cors")
public class CorsProperties {
    
    private List<String> allowedOrigins;
    private List<String> allowedMethods;
    private List<String> allowedHeaders;
    private boolean allowCredentials;
    private List<String> exposedHeaders;
    private long maxAge;
    
    // Getters and Setters
    public List<String> getAllowedOrigins() {
        return allowedOrigins;
    }
    
    public void setAllowedOrigins(List<String> allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }
    
    public List<String> getAllowedMethods() {
        return allowedMethods;
    }
    
    public void setAllowedMethods(List<String> allowedMethods) {
        this.allowedMethods = allowedMethods;
    }
    
    public List<String> getAllowedHeaders() {
        return allowedHeaders;
    }
    
    public void setAllowedHeaders(List<String> allowedHeaders) {
        this.allowedHeaders = allowedHeaders;
    }
    
    public boolean isAllowCredentials() {
        return allowCredentials;
    }
    
    public void setAllowCredentials(boolean allowCredentials) {
        this.allowCredentials = allowCredentials;
    }
    
    public List<String> getExposedHeaders() {
        return exposedHeaders;
    }
    
    public void setExposedHeaders(List<String> exposedHeaders) {
        this.exposedHeaders = exposedHeaders;
    }
    
    public long getMaxAge() {
        return maxAge;
    }
    
    public void setMaxAge(long maxAge) {
        this.maxAge = maxAge;
    }
} 