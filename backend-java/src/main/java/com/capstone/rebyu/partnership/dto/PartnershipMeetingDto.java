package com.capstone.rebyu.partnership.dto;

import com.capstone.rebyu.partnership.entity.PartnershipMeeting;
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
    private Long requestId;

    @NotNull
    private LocalDateTime scheduledAt;

    @Size(max = 500)
    private String meetingLink;

    private PartnershipMeeting.Status status = PartnershipMeeting.Status.scheduled;

    private PartnershipMeeting.Outcome outcome;
}
