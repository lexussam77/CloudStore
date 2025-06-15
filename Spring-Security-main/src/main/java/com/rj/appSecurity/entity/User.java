package com.rj.appSecurity.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.sql.Timestamp;
import java.util.UUID;

@Getter
public class User {
    // Getters and setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "bio")
    private String bio;

    @Column(name = "reference_id")
    private UUID referenceId;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(name = "updated_by")
    private Integer updatedBy;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "update_at")
    private Timestamp updateAt;

    @Column(name = "account_non_expired")
    private Boolean accountNonExpired;

    @Column(name = "account_non_locked")
    private Boolean accountNonLocked;

    @Column(name = "enabled")
    private Boolean enabled;

    @Column(name = "mfa")
    private Boolean mfa;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    public void setId(Long id) { this.id = id; }

    public void setUserId(UUID userId) { this.userId = userId; }

    public void setFirstName(String firstName) { this.firstName = firstName; }

    public void setLastName(String lastName) { this.lastName = lastName; }

    public void setEmail(String email) { this.email = email; }

    public void setPhone(String phone) { this.phone = phone; }

    public void setBio(String bio) { this.bio = bio; }

    public void setReferenceId(UUID referenceId) { this.referenceId = referenceId; }

    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public void setCreatedBy(Integer createdBy) { this.createdBy = createdBy; }

    public void setUpdatedBy(Integer updatedBy) { this.updatedBy = updatedBy; }

    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public void setUpdateAt(Timestamp updateAt) { this.updateAt = updateAt; }

    public void setAccountNonExpired(Boolean accountNonExpired) { this.accountNonExpired = accountNonExpired; }

    public void setAccountNonLocked(Boolean accountNonLocked) { this.accountNonLocked = accountNonLocked; }

    public void setEnabled(Boolean enabled) { this.enabled = enabled; }

    public void setMfa(Boolean mfa) { this.mfa = mfa; }

    public void setUsername(String username) { this.username = username; }

}
