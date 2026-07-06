package com.capstone.rebyu.partnership.controller;

import com.capstone.rebyu.partnership.dto.PartnershipTransactionDtos.PartnershipRequestTransactionDto;
import com.capstone.rebyu.partnership.dto.PartnershipTransactionDtos.SubmitPartnershipRequestDto;
import com.capstone.rebyu.partnership.service.PartnershipRequestTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Transaction Three: partnership request submission and lookup. */
@RestController
@RequestMapping("/api/enterprise/partnership-requests")
@RequiredArgsConstructor
public class PartnershipTransactionController {

    private final PartnershipRequestTransactionService transactionService;

    @PostMapping
    public PartnershipRequestTransactionDto submit(
            @Valid @RequestBody SubmitPartnershipRequestDto request) {
        return transactionService.submit(request);
    }

    @GetMapping
    public List<PartnershipRequestTransactionDto> list(@RequestParam Long enterpriseId) {
        return transactionService.listForEnterprise(enterpriseId);
    }
}
