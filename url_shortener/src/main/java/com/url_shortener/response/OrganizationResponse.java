package com.url_shortener.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrganizationResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private boolean active;
    private String ownerEmail;
    private String ownerName;
    private Long memberCount;
    private Long urlCount;
}