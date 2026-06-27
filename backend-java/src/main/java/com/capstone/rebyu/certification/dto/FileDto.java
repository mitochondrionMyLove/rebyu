package com.capstone.rebyu.certification.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileDto {
    private Long lessonId;
    private String sectionName;
    private String toolId;
    private String folderName;
    private MultipartFile file;
}
