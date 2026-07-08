package com.capstone.rebyu.user.controller;

import com.capstone.rebyu.auth.dto.CurrentUserDto;
import com.capstone.rebyu.auth.service.CognitoAuthService;
import com.capstone.rebyu.common.InvitationAcceptanceException;
import com.capstone.rebyu.user.dto.AcceptInvitationRequest;
import com.capstone.rebyu.user.dto.AcceptInvitationResponse;
import com.capstone.rebyu.user.dto.LearnerDto;
import com.capstone.rebyu.user.service.LearnerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learners")
@RequiredArgsConstructor
public class LearnerController {
    private final LearnerService learnerService;
    private final CognitoAuthService cognitoAuthService;

    @GetMapping
    public List<LearnerDto> getAll() {
        return learnerService.getAll();
    }

    @GetMapping("/{id}")
    public LearnerDto getById(@PathVariable Long id) {
        return learnerService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LearnerDto create(@Valid @RequestBody LearnerDto dto) {
        return learnerService.create(dto);
    }
    /**
     * Accepts an enterprise invitation for the signed-in learner. The learner
     * is resolved from the validated Cognito JWT — never from the request body.
     */
    @PostMapping("accept-invitation")
    @ResponseStatus(HttpStatus.OK)
    public AcceptInvitationResponse acceptInvitation(
            @Valid @RequestBody AcceptInvitationRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            throw new InvitationAcceptanceException(
                    InvitationAcceptanceException.Code.NOT_AUTHENTICATED,
                    "Please sign in to accept this invitation.");
        }
        CurrentUserDto currentUser = cognitoAuthService.syncCurrentUser(jwt, jwt.getTokenValue());
        return learnerService.acceptInvitation(
                currentUser.learnerId(), currentUser.email(), request.token());
    }

    @PutMapping("/{id}")
    public LearnerDto update(@PathVariable Long id, @Valid @RequestBody LearnerDto dto) {
        return learnerService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        learnerService.delete(id);
    }
}
