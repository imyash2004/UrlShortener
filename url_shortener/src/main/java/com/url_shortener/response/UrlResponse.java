package com.url_shortener.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UrlResponse {
    private Long id;
    private String originalUrl;
    private String shortCode;
    private String shortUrl;
    private String title;
    private String description;
    private Long clickCount;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private boolean active;
    private String createdByEmail;
    private String createdByName;
    private String organizationName;
    private Long organizationId;
}
