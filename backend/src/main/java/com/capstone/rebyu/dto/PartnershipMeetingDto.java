package com.capstone.rebyu.dto;

import com.capstone.rebyu.models.PartnershipMeeting;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartnershipMeetingDto {
    private Long meetingId;

    @NotNull
    private Long enterpriseId;

    @NotNull
    private Long requestId;

    @NotNull
    private LocalDateTime scheduledDate;

    @Size(max = 500)
    private String meetingLink;

    private PartnershipMeeting.Outcome outcome;
}
