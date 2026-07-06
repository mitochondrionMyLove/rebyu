package com.capstone.rebyu.partnership.controller;

import com.capstone.rebyu.partnership.dto.EnterpriseInvitationDtos.CertificationAccessDto;
import com.capstone.rebyu.partnership.dto.EnterpriseInvitationDtos.InvitationDto;
import com.capstone.rebyu.partnership.dto.EnterpriseInvitationDtos.SendInvitationsRequest;
import com.capstone.rebyu.partnership.dto.EnterpriseInvitationDtos.SendInvitationsResponse;
import com.capstone.rebyu.partnership.service.EnterpriseInvitationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Transaction Three: enterprise learner invitations and slot management. */
@RestController
@RequestMapping("/api/enterprise")
@RequiredArgsConstructor
public class EnterpriseInvitationController {

    private final EnterpriseInvitationService invitationService;

    @GetMapping("/certification-access")
    public List<CertificationAccessDto> certificationAccess(
            @RequestParam Long enterpriseId) {
        return invitationService.certificationAccess(enterpriseId);
    }

    @PostMapping("/invitations")
    public SendInvitationsResponse send(
            @Valid @RequestBody SendInvitationsRequest request) {
        return invitationService.sendInvitations(request);
    }

    @GetMapping("/invitations")
    public List<InvitationDto> list(@RequestParam Long enterpriseId) {
        return invitationService.listInvitations(enterpriseId);
    }

    @PutMapping("/invitations/{invitationId}/cancel")
    public InvitationDto cancel(
            @PathVariable Long invitationId,
            @RequestParam Long enterpriseId) {
        return invitationService.cancelInvitation(invitationId, enterpriseId);
    }
}
