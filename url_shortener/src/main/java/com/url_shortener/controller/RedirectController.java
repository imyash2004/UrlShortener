package com.url_shortener.controller;


import com.url_shortener.response.ApiResponse;
import com.url_shortener.service.UrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/s")
@RequiredArgsConstructor
public class RedirectController {

    private final UrlService urlService;

    @GetMapping("/api/public/preview/{shortCode}")
    public ResponseEntity<ApiResponse<String>> previewUrl(@PathVariable String shortCode) {
        ApiResponse<String> response = urlService.redirectToOriginalUrl(shortCode);

        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success("Preview URL", response.getData()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/api/public/preview/{organizationId}/{urlId}")
    public ResponseEntity<ApiResponse<String>> previewUrlByOrgAndId(
            @PathVariable Long organizationId,
            @PathVariable Long urlId) {
        ApiResponse<String> response = urlService.redirectToOriginalUrlByOrgAndId(organizationId, urlId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success("Preview URL", response.getData()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/{orgShortName}/{shortCode}")
    public ResponseEntity<?> redirectToOriginalUrlByOrgShortNameAndShortCode(
            @PathVariable String orgShortName,
            @PathVariable String shortCode) {
        ApiResponse<String> response = urlService.redirectToOriginalUrlByOrgShortNameAndShortCode(orgShortName, shortCode);

        if (response.isSuccess()) {
            RedirectView redirectView = new RedirectView();
            redirectView.setUrl(response.getData());
            redirectView.setStatusCode(HttpStatus.MOVED_PERMANENTLY);
            return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY)
                    .header("Location", response.getData())
                    .build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(response);
        }
    }
}
