package com.url_shortener.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateUrlRequest {

    @NotBlank(message = "Original URL is required")
    @URL(message = "Invalid URL format")
    private String originalUrl;

    // For Long fields, use @NotNull instead of @NotBlank
    @NotNull(message = "Organization ID is required")
    private Long organizationId;

    // For String fields that can be optional, you can omit validation
    // or use @Size for length constraints
    @Size(max = 50, message = "Custom short code must be less than 50 characters")
    private String customShortCode;

    @Size(max = 255, message = "Title must be less than 255 characters")
    private String title;

    @Size(max = 500, message = "Description must be less than 500 characters")
    private String description;
    private LocalDateTime expiresAt;
}
