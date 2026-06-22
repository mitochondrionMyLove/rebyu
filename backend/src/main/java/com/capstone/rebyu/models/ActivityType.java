package com.capstone.rebyu.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name ="activity_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityType {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long activityTypeId;

    @Column(name = "activity_type_text", nullable = false, unique = true, length = 50)
    private String activityTypeName;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "activityType")
    private Set<ActivityLog> activityLogs;
}
