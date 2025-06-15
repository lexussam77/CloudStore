package com.rj.appSecurity.service.impl;

import com.rj.appSecurity.cache.CacheStore;
import com.rj.appSecurity.domain.RequestContext;
import com.rj.appSecurity.domain.authenticationDto.UserDto;
import com.rj.appSecurity.entity.ConfirmationEntity;
import com.rj.appSecurity.entity.CredentialEntity;
import com.rj.appSecurity.entity.RoleEntity;
import com.rj.appSecurity.entity.UserEntity;
import com.rj.appSecurity.enumeration.Authority;
import com.rj.appSecurity.enumeration.EventType;
import com.rj.appSecurity.enumeration.LoginType;
import com.rj.appSecurity.event.UserEvent;
import com.rj.appSecurity.exception.ApiException;
import com.rj.appSecurity.repository.ConfirmationRepository;
import com.rj.appSecurity.repository.CredentialRepository;
import com.rj.appSecurity.repository.RoleRepository;
import com.rj.appSecurity.repository.UserRepository;
import com.rj.appSecurity.service.UserService;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import static com.rj.appSecurity.utils.UserUtils.createUserEntity;
import static com.rj.appSecurity.utils.UserUtils.fromUserEntity;

@Service
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CredentialRepository credentialRepository;
    private final ConfirmationRepository confirmationRepository;
    private final CacheStore<String, Integer> userCache;
    private final ApplicationEventPublisher publisher;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void createUser(String firstName, String lastName, String email, String password) {
        // Ensure USER role exists or create it
        RoleEntity userRole = roleRepository.findByNameIgnoreCase("USER")
            .orElseGet(() -> roleRepository.save(RoleEntity.builder().name("USER").build()));
        // Create and save user
        UserEntity userEntity = UserEntity.builder()
            .firstName(firstName)
            .lastName(lastName)
            .email(email)
            .role(userRole)
            .enabled(true)
            .accountNonExpired(true)
            .accountNonLocked(true)
            .build();
        userEntity = userRepository.save(userEntity);
        // Save password
        credentialRepository.save(new CredentialEntity(userEntity, password));
    }

    @Override
    public void verifyAccount(String key) {
        ConfirmationEntity confirmEntity = getUserConfirm(key);
        UserEntity userEntity = getUserEntityByEmail(confirmEntity.getUserEntity().getEmail());
        userEntity.setEnabled(true);
        userRepository.save(userEntity);
        confirmationRepository.delete(confirmEntity);
    }

    private UserEntity getUserEntityByEmail(String email) {
        var userByEmail = userRepository.findByEmailIgnoreCase(email);
        return userByEmail.orElseThrow(() -> new ApiException("User not found"));
    }

    private ConfirmationEntity getUserConfirm(String key) {
        return confirmationRepository.findByKey(key).orElse(null);
    }

    @Override
    public RoleEntity getRoleName(String name) {
        var role = roleRepository.findByNameIgnoreCase(name);
        return role.orElseThrow(() -> new ApiException("Role not found"));
    }

    @PostConstruct
    public void ensureDefaultRoles() {
        String userRoleName = Authority.USER.name();
        if (roleRepository.findByNameIgnoreCase(userRoleName).isEmpty()) {
            RoleEntity userRole = new RoleEntity();
            userRole.setName(userRoleName);
            userRole.setAuthorities(Authority.USER);
            roleRepository.save(userRole);
            log.info("Default USER role created.");
        }
    }

    private UserEntity createNewUser(String firstName, String lastName, String email, String password) {
        // Ensure USER role exists before assigning
        ensureDefaultRoles();
        var role = getRoleName(Authority.USER.name());
        return createUserEntity(firstName, lastName, email, role);
    }

    @Override
    public void updateLoginAttempt(String email, LoginType loginType) {
        var userEntity = getUserEntityByEmail(email);
        RequestContext.setUserId(userEntity.getId());
        switch (loginType) {
            case LOGIN_ATTEMPT:
                if (userCache.get(userEntity.getEmail()) == null) {
                    userEntity.setLoginAttempts(0);
                    userEntity.setAccountNonLocked(false);
                }
                userEntity.setLoginAttempts(userEntity.getLoginAttempts() + 1);
                userCache.put(userEntity.getEmail(), userEntity.getLoginAttempts());
                if (userCache.get(userEntity.getEmail()) > 5) {
                    userEntity.setAccountNonLocked(false);
                }
                break;
            case LOGOUT_SUCCESS:
                userEntity.setLoginAttempts(0);
                userEntity.setAccountNonLocked(true);
                userEntity.setLastLogin(LocalDateTime.now());
                userCache.evict(userEntity.getEmail());
                break;
        }
        userRepository.save(userEntity);
    }

    @Override
    public UserDto getUserByUserId(String userId) {
        var userEntity = userRepository.findUserEntityByUserId(userId).orElseThrow(() -> new ApiException("User not found"));
        return fromUserEntity(userEntity,userEntity.getRole(),getUserCredentialById(userEntity.getId()));
    }

    @Override
    public UserDto getUserByEmail(String email) {
        UserEntity userEntity = getUserEntityByEmail(email);
        return fromUserEntity(userEntity,userEntity.getRole(),getUserCredentialById(userEntity.getId()));
    }



    @Override
    public CredentialEntity getUserCredentialById(Long userID) {
      var CredentialBy  = credentialRepository.getCredentialEntityByUserEntityId(userID);
        return CredentialBy.orElseThrow(() -> new ApiException("Unable to find user Credential"));
    }

    @Override
    public UserEntity register(String username, String email, String password) {
        // Ensure USER role exists or create it
        RoleEntity userRole = roleRepository.findByNameIgnoreCase("USER")
            .orElseGet(() -> roleRepository.save(RoleEntity.builder().name("USER").build()));
        // Encode password
        String encodedPassword = passwordEncoder.encode(password);
        // Generate a unique userId
        String userId = UUID.randomUUID().toString();
        // Create and save user
        UserEntity userEntity = UserEntity.builder()
            .username(username)
            .email(email)
            .password(encodedPassword)
            .userId(userId)
            .role(userRole)
            .enabled(true)
            .accountNonExpired(true)
            .accountNonLocked(true)
            .build();
        userEntity = userRepository.save(userEntity);
        // Save encoded password in credentials as well
        credentialRepository.save(new CredentialEntity(userEntity, encodedPassword));
        return userEntity;
    }
}
