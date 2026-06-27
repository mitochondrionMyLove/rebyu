# REBYU Modular Monolith Plan

Phase: analysis only. No production code has been moved or modified by this plan.

## 1. Current Project Folder Tree

```text
.
|-- .mvn/
|-- mvnw
|-- mvnw.cmd
|-- pom.xml
|-- src/
|   |-- main/
|   |   |-- java/com/capstone/rebyu/
|   |   |   |-- RebyuApplication.java
|   |   |   |-- config/
|   |   |   |   |-- CorsConfig.java
|   |   |   |   |-- S3Config.java
|   |   |   |   `-- SecurityConfig.java
|   |   |   |-- controllers/
|   |   |   |   |-- AchievementController.java
|   |   |   |   |-- ActivityLogController.java
|   |   |   |   |-- ActivityTypeController.java
|   |   |   |   |-- CertificationController.java
|   |   |   |   |-- ChallengeModeController.java
|   |   |   |   |-- ChallengeSessionController.java
|   |   |   |   |-- ChoiceController.java
|   |   |   |   |-- DifficultyLevelController.java
|   |   |   |   |-- EnterpriseController.java
|   |   |   |   |-- ExamChoiceController.java
|   |   |   |   |-- ExamController.java
|   |   |   |   |-- ExamQuestionController.java
|   |   |   |   |-- ExamResultController.java
|   |   |   |   |-- ExamTypeController.java
|   |   |   |   |-- FileController.java
|   |   |   |   |-- LearnerAchievementController.java
|   |   |   |   |-- LearnerCertificationController.java
|   |   |   |   |-- LearnerCompletedLessonController.java
|   |   |   |   |-- LearnerController.java
|   |   |   |   |-- LearnerExamDetailController.java
|   |   |   |   |-- LearnerInvitationController.java
|   |   |   |   |-- LearnerLessonMasteryController.java
|   |   |   |   |-- LessonController.java
|   |   |   |   |-- MajorCategoryController.java
|   |   |   |   |-- MiddleCategoryController.java
|   |   |   |   |-- NoChoiceQuestionController.java
|   |   |   |   |-- OrganizationCertificateController.java
|   |   |   |   |-- OrganizationCertificationLearnerController.java
|   |   |   |   |-- PartnershipMeetingController.java
|   |   |   |   |-- PartnershipRequestController.java
|   |   |   |   |-- PartnershipRequestItemController.java
|   |   |   |   |-- QuestionController.java
|   |   |   |   |-- QuestionTypeController.java
|   |   |   |   |-- UserController.java
|   |   |   |   |-- UserTypeController.java
|   |   |   |   `-- WeakAreaController.java
|   |   |   |-- dto/
|   |   |   |-- mappers/
|   |   |   |-- models/
|   |   |   |-- repositories/
|   |   |   |-- services/
|   |   |   `-- utils/
|   |   |       `-- JsonStringDeserializer.java
|   |   `-- resources/application.yaml
|   `-- test/java/com/capstone/rebyu/
|       `-- RebyuApplicationTests.java
`-- target/
```

Notes:
- Current worktree was already dirty before this plan. Existing modified/new files include `pom.xml`, lesson media/S3 backend files, `application.yaml`, and unrelated frontend changes outside this backend root.
- There is no `src/main/resources/db/migration` folder in the inspected backend tree.

## 2. Proposed Final Folder Tree

Create only folders that contain files.

```text
src/main/java/com/capstone/rebyu/
|-- RebyuApplication.java
|-- common/
|   |-- config/
|   |   |-- CorsConfig.java
|   |   `-- S3Config.java
|   |-- security/
|   |   `-- SecurityConfig.java
|   `-- util/
|       `-- JsonStringDeserializer.java
|-- auth/
|   `-- service/
|       `-- CustomUserService.java
|-- user/
|   |-- controller/
|   |-- dto/
|   |-- entity/
|   |-- mapper/
|   |-- repository/
|   `-- service/
|-- organization/
|   |-- controller/
|   |-- dto/
|   |-- entity/
|   |-- mapper/
|   |-- repository/
|   `-- service/
|-- partnership/
|   |-- controller/
|   |-- dto/
|   |-- entity/
|   |-- mapper/
|   |-- repository/
|   `-- service/
|-- certification/
|   |-- controller/
|   |-- dto/
|   |-- entity/
|   |-- mapper/
|   |-- repository/
|   `-- service/
|-- lesson/
|   |-- controller/
|   |-- dto/
|   |-- entity/
|   |-- mapper/
|   |-- repository/
|   `-- service/
|-- enrollment/
|   |-- controller/
|   |-- dto/
|   |-- entity/
|   |-- mapper/
|   |-- repository/
|   `-- service/
|-- assessment/
|   |-- controller/
|   |-- dto/
|   |-- entity/
|   |-- mapper/
|   |-- repository/
|   `-- service/
|-- progress/
|   |-- controller/
|   |-- dto/
|   |-- entity/
|   |-- mapper/
|   |-- repository/
|   `-- service/
|-- challenge/
|   |-- controller/
|   |-- dto/
|   |-- entity/
|   |-- mapper/
|   |-- repository/
|   `-- service/
`-- notification/
    |-- controller/
    |-- dto/
    |-- entity/
    |-- mapper/
    |-- repository/
    `-- service/
```

Analytics has no current Java files to move. Keep analytics absent until external FastAPI AI client/request/response code exists.

## 3. Current Inventory

### Entities / Models

- `Achievement`
- `ActivityLog`
- `ActivityType`
- `Certification`
- `ChallengeMode`
- `ChallengeSession`
- `Choice`
- `DifficultyLevel`
- `Enterprise`
- `Exam`
- `ExamChoice`
- `ExamChoiceId`
- `ExamQuestion`
- `ExamResult`
- `ExamResultId`
- `ExamType`
- `Learner`
- `LearnerAchievement`
- `LearnerAchievementId`
- `LearnerCertification`
- `LearnerCertificationId`
- `LearnerCompletedLesson`
- `LearnerCompletedLessonId`
- `LearnerExamDetail`
- `LearnerExamDetailId`
- `LearnerInvitation`
- `LearnerLessonMastery`
- `LearnerLessonMasteryId`
- `Lesson`
- `LessonImage`
- `LessonVideo`
- `MajorCategory`
- `MiddleCategory`
- `NoChoiceQuestion`
- `OrganizationCertificate`
- `OrganizationCertificationLearner`
- `PartnershipMeeting`
- `PartnershipRequest`
- `PartnershipRequestItem`
- `Question`
- `QuestionType`
- `User`
- `UserType`
- `WeakArea`
- `WeakAreaId`

### Repositories

- `AchievementRepository`
- `ActivityLogRepository`
- `ActivityTypeRepository`
- `CertificationRepository`
- `ChallengeModeRepository`
- `ChallengeSessionRepository`
- `ChoiceRepository`
- `DifficultyLevelRepository`
- `EnterpriseRepository`
- `ExamChoiceRepository`
- `ExamQuestionRepository`
- `ExamRepository`
- `ExamResultRepository`
- `ExamTypeRepository`
- `LearnerAchievementRepository`
- `LearnerCertificationRepository`
- `LearnerCompletedLessonRepository`
- `LearnerExamDetailRepository`
- `LearnerInvitationRepository`
- `LearnerLessonMasteryRepository`
- `LearnerRepository`
- `LessonImageRepository`
- `LessonRepository`
- `LessonVideoRepository`
- `MajorCategoryRepository`
- `MiddleCategoryRepository`
- `NoChoiceQuestionRepository`
- `OrganizationCertificateRepository`
- `OrganizationCertificationLearnerRepository`
- `PartnershipMeetingRepository`
- `PartnershipRequestItemRepository`
- `PartnershipRequestRepository`
- `QuestionRepository`
- `QuestionTypeRepository`
- `UserRepository`
- `UserTypeRepository`
- `WeakAreaRepository`

### Services

- `AchievementService`
- `ActivityLogService`
- `ActivityTypeService`
- `CertificationService`
- `ChallengeModeService`
- `ChallengeSessionService`
- `ChoiceService`
- `CustomUserService`
- `DifficultyLevelService`
- `EnterpriseService`
- `ExamChoiceService`
- `ExamQuestionService`
- `ExamResultService`
- `ExamService`
- `ExamTypeService`
- `LearnerAchievementService`
- `LearnerCertificationService`
- `LearnerCompletedLessonService`
- `LearnerExamDetailService`
- `LearnerInvitationService`
- `LearnerLessonMasteryService`
- `LearnerService`
- `LessonImageService`
- `LessonService`
- `LessonVideoService`
- `MajorCategoryService`
- `MiddleCategoryService`
- `NoChoiceQuestionService`
- `OrganizationCertificateService`
- `OrganizationCertificationLearnerService`
- `PartnershipMeetingService`
- `PartnershipRequestItemService`
- `PartnershipRequestService`
- `QuestionService`
- `QuestionTypeService`
- `S3StorageService`
- `UserService`
- `UserTypeService`
- `WeakAreaService`

### Controllers

- `AchievementController`
- `ActivityLogController`
- `ActivityTypeController`
- `CertificationController`
- `ChallengeModeController`
- `ChallengeSessionController`
- `ChoiceController`
- `DifficultyLevelController`
- `EnterpriseController`
- `ExamChoiceController`
- `ExamController`
- `ExamQuestionController`
- `ExamResultController`
- `ExamTypeController`
- `FileController`
- `LearnerAchievementController`
- `LearnerCertificationController`
- `LearnerCompletedLessonController`
- `LearnerController`
- `LearnerExamDetailController`
- `LearnerInvitationController`
- `LearnerLessonMasteryController`
- `LessonController`
- `MajorCategoryController`
- `MiddleCategoryController`
- `NoChoiceQuestionController`
- `OrganizationCertificateController`
- `OrganizationCertificationLearnerController`
- `PartnershipMeetingController`
- `PartnershipRequestController`
- `PartnershipRequestItemController`
- `QuestionController`
- `QuestionTypeController`
- `UserController`
- `UserTypeController`
- `WeakAreaController`

### DTOs

- `AchievementDto`
- `ActivityLogDto`
- `ActivityTypeDto`
- `CertificationDto`
- `ChallengeModeDto`
- `ChallengeSessionDto`
- `ChoiceDto`
- `DifficultyLevelDto`
- `EnterpriseDto`
- `ExamChoiceDto`
- `ExamDto`
- `ExamQuestionDto`
- `ExamResultDto`
- `ExamTypeDto`
- `FileDto`
- `LearnerAchievementDto`
- `LearnerCertificationDto`
- `LearnerCompletedLessonDto`
- `LearnerDto`
- `LearnerExamDetailDto`
- `LearnerInvitationDto`
- `LearnerLessonMasteryDto`
- `LessonDto`
- `LessonImageDto`
- `LessonVideoDto`
- `MajorCategoryDto`
- `MiddleCategoryDto`
- `NoChoiceQuestionDto`
- `OrganizationCertificateDto`
- `OrganizationCertificationLearnerDto`
- `PartnershipMeetingDto`
- `PartnershipRequestDto`
- `PartnershipRequestItemDto`
- `QuestionDto`
- `QuestionTypeDto`
- `UserDto`
- `UserTypeDto`
- `WeakAreaDto`

### Mappers

- `AchievementMapper`
- `ActivityLogMapper`
- `ActivityTypeMapper`
- `CertificationMapper`
- `ChallengeModeMapper`
- `ChallengeSessionMapper`
- `ChoiceMapper`
- `DifficultyLevelMapper`
- `EnterpriseMapper`
- `ExamChoiceMapper`
- `ExamMapper`
- `ExamQuestionMapper`
- `ExamResultMapper`
- `ExamTypeMapper`
- `LearnerAchievementMapper`
- `LearnerCertificationMapper`
- `LearnerCompletedLessonMapper`
- `LearnerExamDetailMapper`
- `LearnerInvitationMapper`
- `LearnerLessonMasteryMapper`
- `LearnerMapper`
- `LessonImageMapper`
- `LessonMapper`
- `LessonVideoMapper`
- `MajorCategoryMapper`
- `MiddleCategoryMapper`
- `NoChoiceQuestionMapper`
- `OrganizationCertificateMapper`
- `OrganizationCertificationLearnerMapper`
- `PartnershipMeetingMapper`
- `PartnershipRequestItemMapper`
- `PartnershipRequestMapper`
- `QuestionMapper`
- `QuestionTypeMapper`
- `UserMapper`
- `UserTypeMapper`
- `WeakAreaMapper`

### Configuration, Security, Utilities, Tests

- `RebyuApplication`
- `CorsConfig`
- `S3Config`
- `SecurityConfig`
- `JsonStringDeserializer`
- `RebyuApplicationTests`

## 4. Migration Table

| Current File Path | New File Path | Module Owner | Reason |
|---|---|---|---|
| `src/main/java/com/capstone/rebyu/config/CorsConfig.java` | `src/main/java/com/capstone/rebyu/common/config/CorsConfig.java` | common | Global CORS infrastructure. |
| `src/main/java/com/capstone/rebyu/config/S3Config.java` | `src/main/java/com/capstone/rebyu/common/config/S3Config.java` | common | AWS client/config infrastructure. |
| `src/main/java/com/capstone/rebyu/config/SecurityConfig.java` | `src/main/java/com/capstone/rebyu/common/security/SecurityConfig.java` | common | Global Spring Security filter chain; no module-specific auth endpoints currently. |
| `src/main/java/com/capstone/rebyu/utils/JsonStringDeserializer.java` | `src/main/java/com/capstone/rebyu/common/util/JsonStringDeserializer.java` | common | Reusable JSON utility used by lesson component structure. |
| `src/main/java/com/capstone/rebyu/services/CustomUserService.java` | `src/main/java/com/capstone/rebyu/auth/service/CustomUserService.java` | auth | Implements `UserDetailsService`; authentication concern, although currently incomplete. |
| `src/main/java/com/capstone/rebyu/controllers/UserController.java` | `src/main/java/com/capstone/rebyu/user/controller/UserController.java` | user | User account API. |
| `src/main/java/com/capstone/rebyu/controllers/UserTypeController.java` | `src/main/java/com/capstone/rebyu/user/controller/UserTypeController.java` | user | User role/type API. |
| `src/main/java/com/capstone/rebyu/dto/UserDto.java` | `src/main/java/com/capstone/rebyu/user/dto/UserDto.java` | user | User account DTO. |
| `src/main/java/com/capstone/rebyu/dto/UserTypeDto.java` | `src/main/java/com/capstone/rebyu/user/dto/UserTypeDto.java` | user | User role/type DTO. |
| `src/main/java/com/capstone/rebyu/mappers/UserMapper.java` | `src/main/java/com/capstone/rebyu/user/mapper/UserMapper.java` | user | Maps user entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/UserTypeMapper.java` | `src/main/java/com/capstone/rebyu/user/mapper/UserTypeMapper.java` | user | Maps user type entity/DTO. |
| `src/main/java/com/capstone/rebyu/models/User.java` | `src/main/java/com/capstone/rebyu/user/entity/User.java` | user | User account data. |
| `src/main/java/com/capstone/rebyu/models/UserType.java` | `src/main/java/com/capstone/rebyu/user/entity/UserType.java` | user | User role/type data. |
| `src/main/java/com/capstone/rebyu/repositories/UserRepository.java` | `src/main/java/com/capstone/rebyu/user/repository/UserRepository.java` | user | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/UserTypeRepository.java` | `src/main/java/com/capstone/rebyu/user/repository/UserTypeRepository.java` | user | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/services/UserService.java` | `src/main/java/com/capstone/rebyu/user/service/UserService.java` | user | User account service. |
| `src/main/java/com/capstone/rebyu/services/UserTypeService.java` | `src/main/java/com/capstone/rebyu/user/service/UserTypeService.java` | user | User role/type service. |
| `src/main/java/com/capstone/rebyu/controllers/LearnerController.java` | `src/main/java/com/capstone/rebyu/user/controller/LearnerController.java` | user | Learner profile/account record. |
| `src/main/java/com/capstone/rebyu/dto/LearnerDto.java` | `src/main/java/com/capstone/rebyu/user/dto/LearnerDto.java` | user | Learner profile DTO. |
| `src/main/java/com/capstone/rebyu/mappers/LearnerMapper.java` | `src/main/java/com/capstone/rebyu/user/mapper/LearnerMapper.java` | user | Maps learner profile entity/DTO. |
| `src/main/java/com/capstone/rebyu/models/Learner.java` | `src/main/java/com/capstone/rebyu/user/entity/Learner.java` | user | Learner profile is user account data. |
| `src/main/java/com/capstone/rebyu/repositories/LearnerRepository.java` | `src/main/java/com/capstone/rebyu/user/repository/LearnerRepository.java` | user | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/services/LearnerService.java` | `src/main/java/com/capstone/rebyu/user/service/LearnerService.java` | user | Learner profile service. |
| `src/main/java/com/capstone/rebyu/controllers/EnterpriseController.java` | `src/main/java/com/capstone/rebyu/organization/controller/EnterpriseController.java` | organization | Enterprise represents organization records. |
| `src/main/java/com/capstone/rebyu/dto/EnterpriseDto.java` | `src/main/java/com/capstone/rebyu/organization/dto/EnterpriseDto.java` | organization | Organization/enterprise DTO. |
| `src/main/java/com/capstone/rebyu/mappers/EnterpriseMapper.java` | `src/main/java/com/capstone/rebyu/organization/mapper/EnterpriseMapper.java` | organization | Maps organization/enterprise entity/DTO. |
| `src/main/java/com/capstone/rebyu/models/Enterprise.java` | `src/main/java/com/capstone/rebyu/organization/entity/Enterprise.java` | organization | Enterprise organization record. |
| `src/main/java/com/capstone/rebyu/repositories/EnterpriseRepository.java` | `src/main/java/com/capstone/rebyu/organization/repository/EnterpriseRepository.java` | organization | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/services/EnterpriseService.java` | `src/main/java/com/capstone/rebyu/organization/service/EnterpriseService.java` | organization | Organization/enterprise service. |
| `src/main/java/com/capstone/rebyu/controllers/OrganizationCertificateController.java` | `src/main/java/com/capstone/rebyu/organization/controller/OrganizationCertificateController.java` | organization | Enterprise-owned certification/slot record. |
| `src/main/java/com/capstone/rebyu/dto/OrganizationCertificateDto.java` | `src/main/java/com/capstone/rebyu/organization/dto/OrganizationCertificateDto.java` | organization | Organization certificate DTO. |
| `src/main/java/com/capstone/rebyu/mappers/OrganizationCertificateMapper.java` | `src/main/java/com/capstone/rebyu/organization/mapper/OrganizationCertificateMapper.java` | organization | Maps organization certificate entity/DTO. |
| `src/main/java/com/capstone/rebyu/models/OrganizationCertificate.java` | `src/main/java/com/capstone/rebyu/organization/entity/OrganizationCertificate.java` | organization | Organization's certification allocation record. |
| `src/main/java/com/capstone/rebyu/repositories/OrganizationCertificateRepository.java` | `src/main/java/com/capstone/rebyu/organization/repository/OrganizationCertificateRepository.java` | organization | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/services/OrganizationCertificateService.java` | `src/main/java/com/capstone/rebyu/organization/service/OrganizationCertificateService.java` | organization | Organization certificate service. |
| `src/main/java/com/capstone/rebyu/controllers/PartnershipRequestController.java` | `src/main/java/com/capstone/rebyu/partnership/controller/PartnershipRequestController.java` | partnership | Partnership request workflow. |
| `src/main/java/com/capstone/rebyu/controllers/PartnershipRequestItemController.java` | `src/main/java/com/capstone/rebyu/partnership/controller/PartnershipRequestItemController.java` | partnership | Partnership request line items. |
| `src/main/java/com/capstone/rebyu/controllers/PartnershipMeetingController.java` | `src/main/java/com/capstone/rebyu/partnership/controller/PartnershipMeetingController.java` | partnership | Partnership approval/meeting workflow. |
| `src/main/java/com/capstone/rebyu/dto/PartnershipRequestDto.java` | `src/main/java/com/capstone/rebyu/partnership/dto/PartnershipRequestDto.java` | partnership | Partnership request DTO. |
| `src/main/java/com/capstone/rebyu/dto/PartnershipRequestItemDto.java` | `src/main/java/com/capstone/rebyu/partnership/dto/PartnershipRequestItemDto.java` | partnership | Partnership request item DTO. |
| `src/main/java/com/capstone/rebyu/dto/PartnershipMeetingDto.java` | `src/main/java/com/capstone/rebyu/partnership/dto/PartnershipMeetingDto.java` | partnership | Partnership meeting DTO. |
| `src/main/java/com/capstone/rebyu/mappers/PartnershipRequestMapper.java` | `src/main/java/com/capstone/rebyu/partnership/mapper/PartnershipRequestMapper.java` | partnership | Maps partnership request entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/PartnershipRequestItemMapper.java` | `src/main/java/com/capstone/rebyu/partnership/mapper/PartnershipRequestItemMapper.java` | partnership | Maps partnership request item entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/PartnershipMeetingMapper.java` | `src/main/java/com/capstone/rebyu/partnership/mapper/PartnershipMeetingMapper.java` | partnership | Maps partnership meeting entity/DTO. |
| `src/main/java/com/capstone/rebyu/models/PartnershipRequest.java` | `src/main/java/com/capstone/rebyu/partnership/entity/PartnershipRequest.java` | partnership | Partnership workflow entity. |
| `src/main/java/com/capstone/rebyu/models/PartnershipRequestItem.java` | `src/main/java/com/capstone/rebyu/partnership/entity/PartnershipRequestItem.java` | partnership | Partnership workflow item entity. |
| `src/main/java/com/capstone/rebyu/models/PartnershipMeeting.java` | `src/main/java/com/capstone/rebyu/partnership/entity/PartnershipMeeting.java` | partnership | Partnership meeting workflow entity. |
| `src/main/java/com/capstone/rebyu/repositories/PartnershipRequestRepository.java` | `src/main/java/com/capstone/rebyu/partnership/repository/PartnershipRequestRepository.java` | partnership | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/PartnershipRequestItemRepository.java` | `src/main/java/com/capstone/rebyu/partnership/repository/PartnershipRequestItemRepository.java` | partnership | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/PartnershipMeetingRepository.java` | `src/main/java/com/capstone/rebyu/partnership/repository/PartnershipMeetingRepository.java` | partnership | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/services/PartnershipRequestService.java` | `src/main/java/com/capstone/rebyu/partnership/service/PartnershipRequestService.java` | partnership | Partnership request service. |
| `src/main/java/com/capstone/rebyu/services/PartnershipRequestItemService.java` | `src/main/java/com/capstone/rebyu/partnership/service/PartnershipRequestItemService.java` | partnership | Partnership request item service. |
| `src/main/java/com/capstone/rebyu/services/PartnershipMeetingService.java` | `src/main/java/com/capstone/rebyu/partnership/service/PartnershipMeetingService.java` | partnership | Partnership meeting service. |
| `src/main/java/com/capstone/rebyu/controllers/CertificationController.java` | `src/main/java/com/capstone/rebyu/certification/controller/CertificationController.java` | certification | Certification metadata API. |
| `src/main/java/com/capstone/rebyu/controllers/MajorCategoryController.java` | `src/main/java/com/capstone/rebyu/certification/controller/MajorCategoryController.java` | certification | Certification category API. |
| `src/main/java/com/capstone/rebyu/controllers/MiddleCategoryController.java` | `src/main/java/com/capstone/rebyu/certification/controller/MiddleCategoryController.java` | certification | Certification category API. |
| `src/main/java/com/capstone/rebyu/dto/CertificationDto.java` | `src/main/java/com/capstone/rebyu/certification/dto/CertificationDto.java` | certification | Certification metadata DTO. |
| `src/main/java/com/capstone/rebyu/dto/MajorCategoryDto.java` | `src/main/java/com/capstone/rebyu/certification/dto/MajorCategoryDto.java` | certification | Major category DTO. |
| `src/main/java/com/capstone/rebyu/dto/MiddleCategoryDto.java` | `src/main/java/com/capstone/rebyu/certification/dto/MiddleCategoryDto.java` | certification | Middle category DTO. |
| `src/main/java/com/capstone/rebyu/mappers/CertificationMapper.java` | `src/main/java/com/capstone/rebyu/certification/mapper/CertificationMapper.java` | certification | Maps certification graph. |
| `src/main/java/com/capstone/rebyu/mappers/MajorCategoryMapper.java` | `src/main/java/com/capstone/rebyu/certification/mapper/MajorCategoryMapper.java` | certification | Maps category graph. |
| `src/main/java/com/capstone/rebyu/mappers/MiddleCategoryMapper.java` | `src/main/java/com/capstone/rebyu/certification/mapper/MiddleCategoryMapper.java` | certification | Maps category graph, currently uses `LessonMapper`. |
| `src/main/java/com/capstone/rebyu/models/Certification.java` | `src/main/java/com/capstone/rebyu/certification/entity/Certification.java` | certification | Certification metadata entity. |
| `src/main/java/com/capstone/rebyu/models/MajorCategory.java` | `src/main/java/com/capstone/rebyu/certification/entity/MajorCategory.java` | certification | Certification category entity. |
| `src/main/java/com/capstone/rebyu/models/MiddleCategory.java` | `src/main/java/com/capstone/rebyu/certification/entity/MiddleCategory.java` | certification | Certification category entity. |
| `src/main/java/com/capstone/rebyu/repositories/CertificationRepository.java` | `src/main/java/com/capstone/rebyu/certification/repository/CertificationRepository.java` | certification | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/MajorCategoryRepository.java` | `src/main/java/com/capstone/rebyu/certification/repository/MajorCategoryRepository.java` | certification | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/MiddleCategoryRepository.java` | `src/main/java/com/capstone/rebyu/certification/repository/MiddleCategoryRepository.java` | certification | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/services/CertificationService.java` | `src/main/java/com/capstone/rebyu/certification/service/CertificationService.java` | certification | Certification metadata service. |
| `src/main/java/com/capstone/rebyu/services/MajorCategoryService.java` | `src/main/java/com/capstone/rebyu/certification/service/MajorCategoryService.java` | certification | Category service. |
| `src/main/java/com/capstone/rebyu/services/MiddleCategoryService.java` | `src/main/java/com/capstone/rebyu/certification/service/MiddleCategoryService.java` | certification | Category service. |
| `src/main/java/com/capstone/rebyu/controllers/LessonController.java` | `src/main/java/com/capstone/rebyu/lesson/controller/LessonController.java` | lesson | Lesson content API. |
| `src/main/java/com/capstone/rebyu/controllers/FileController.java` | `src/main/java/com/capstone/rebyu/lesson/controller/FileController.java` | lesson | Current file upload service writes lesson image/video records. |
| `src/main/java/com/capstone/rebyu/dto/LessonDto.java` | `src/main/java/com/capstone/rebyu/lesson/dto/LessonDto.java` | lesson | Lesson DTO. |
| `src/main/java/com/capstone/rebyu/dto/LessonImageDto.java` | `src/main/java/com/capstone/rebyu/lesson/dto/LessonImageDto.java` | lesson | Lesson image media DTO. |
| `src/main/java/com/capstone/rebyu/dto/LessonVideoDto.java` | `src/main/java/com/capstone/rebyu/lesson/dto/LessonVideoDto.java` | lesson | Lesson video media DTO. |
| `src/main/java/com/capstone/rebyu/dto/FileDto.java` | `src/main/java/com/capstone/rebyu/lesson/dto/FileDto.java` | lesson | Upload request DTO tied to lesson media. |
| `src/main/java/com/capstone/rebyu/mappers/LessonMapper.java` | `src/main/java/com/capstone/rebyu/lesson/mapper/LessonMapper.java` | lesson | Maps lesson entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/LessonImageMapper.java` | `src/main/java/com/capstone/rebyu/lesson/mapper/LessonImageMapper.java` | lesson | Maps lesson image entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/LessonVideoMapper.java` | `src/main/java/com/capstone/rebyu/lesson/mapper/LessonVideoMapper.java` | lesson | Maps lesson video entity/DTO. |
| `src/main/java/com/capstone/rebyu/models/Lesson.java` | `src/main/java/com/capstone/rebyu/lesson/entity/Lesson.java` | lesson | Lesson content entity. |
| `src/main/java/com/capstone/rebyu/models/LessonImage.java` | `src/main/java/com/capstone/rebyu/lesson/entity/LessonImage.java` | lesson | Lesson image media entity. |
| `src/main/java/com/capstone/rebyu/models/LessonVideo.java` | `src/main/java/com/capstone/rebyu/lesson/entity/LessonVideo.java` | lesson | Lesson video media entity. |
| `src/main/java/com/capstone/rebyu/repositories/LessonRepository.java` | `src/main/java/com/capstone/rebyu/lesson/repository/LessonRepository.java` | lesson | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/LessonImageRepository.java` | `src/main/java/com/capstone/rebyu/lesson/repository/LessonImageRepository.java` | lesson | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/LessonVideoRepository.java` | `src/main/java/com/capstone/rebyu/lesson/repository/LessonVideoRepository.java` | lesson | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/services/LessonService.java` | `src/main/java/com/capstone/rebyu/lesson/service/LessonService.java` | lesson | Lesson content service. |
| `src/main/java/com/capstone/rebyu/services/LessonImageService.java` | `src/main/java/com/capstone/rebyu/lesson/service/LessonImageService.java` | lesson | Lesson image media service. |
| `src/main/java/com/capstone/rebyu/services/LessonVideoService.java` | `src/main/java/com/capstone/rebyu/lesson/service/LessonVideoService.java` | lesson | Lesson video media service. |
| `src/main/java/com/capstone/rebyu/services/S3StorageService.java` | `src/main/java/com/capstone/rebyu/lesson/service/S3StorageService.java` | lesson | Current storage service persists lesson image/video metadata. |
| `src/main/java/com/capstone/rebyu/controllers/LearnerCertificationController.java` | `src/main/java/com/capstone/rebyu/enrollment/controller/LearnerCertificationController.java` | enrollment | Learner certification access/purchase record. |
| `src/main/java/com/capstone/rebyu/controllers/OrganizationCertificationLearnerController.java` | `src/main/java/com/capstone/rebyu/enrollment/controller/OrganizationCertificationLearnerController.java` | enrollment | Enterprise learner assignment. |
| `src/main/java/com/capstone/rebyu/dto/LearnerCertificationDto.java` | `src/main/java/com/capstone/rebyu/enrollment/dto/LearnerCertificationDto.java` | enrollment | Learner enrollment DTO. |
| `src/main/java/com/capstone/rebyu/dto/OrganizationCertificationLearnerDto.java` | `src/main/java/com/capstone/rebyu/enrollment/dto/OrganizationCertificationLearnerDto.java` | enrollment | Enterprise learner assignment DTO. |
| `src/main/java/com/capstone/rebyu/mappers/LearnerCertificationMapper.java` | `src/main/java/com/capstone/rebyu/enrollment/mapper/LearnerCertificationMapper.java` | enrollment | Maps learner certification entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/OrganizationCertificationLearnerMapper.java` | `src/main/java/com/capstone/rebyu/enrollment/mapper/OrganizationCertificationLearnerMapper.java` | enrollment | Maps enterprise learner assignment entity/DTO. |
| `src/main/java/com/capstone/rebyu/models/LearnerCertification.java` | `src/main/java/com/capstone/rebyu/enrollment/entity/LearnerCertification.java` | enrollment | Learner certification access/purchase entity. |
| `src/main/java/com/capstone/rebyu/models/LearnerCertificationId.java` | `src/main/java/com/capstone/rebyu/enrollment/entity/LearnerCertificationId.java` | enrollment | Embedded ID belongs with owning entity. |
| `src/main/java/com/capstone/rebyu/models/OrganizationCertificationLearner.java` | `src/main/java/com/capstone/rebyu/enrollment/entity/OrganizationCertificationLearner.java` | enrollment | Enterprise learner assignment entity. |
| `src/main/java/com/capstone/rebyu/repositories/LearnerCertificationRepository.java` | `src/main/java/com/capstone/rebyu/enrollment/repository/LearnerCertificationRepository.java` | enrollment | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/OrganizationCertificationLearnerRepository.java` | `src/main/java/com/capstone/rebyu/enrollment/repository/OrganizationCertificationLearnerRepository.java` | enrollment | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/services/LearnerCertificationService.java` | `src/main/java/com/capstone/rebyu/enrollment/service/LearnerCertificationService.java` | enrollment | Learner certification access service. |
| `src/main/java/com/capstone/rebyu/services/OrganizationCertificationLearnerService.java` | `src/main/java/com/capstone/rebyu/enrollment/service/OrganizationCertificationLearnerService.java` | enrollment | Enterprise learner assignment service. |
| `src/main/java/com/capstone/rebyu/controllers/QuestionController.java` | `src/main/java/com/capstone/rebyu/assessment/controller/QuestionController.java` | assessment | Question bank API. |
| `src/main/java/com/capstone/rebyu/controllers/QuestionTypeController.java` | `src/main/java/com/capstone/rebyu/assessment/controller/QuestionTypeController.java` | assessment | Question type API. |
| `src/main/java/com/capstone/rebyu/controllers/ChoiceController.java` | `src/main/java/com/capstone/rebyu/assessment/controller/ChoiceController.java` | assessment | Answer choice API. |
| `src/main/java/com/capstone/rebyu/controllers/NoChoiceQuestionController.java` | `src/main/java/com/capstone/rebyu/assessment/controller/NoChoiceQuestionController.java` | assessment | Free-answer question API. |
| `src/main/java/com/capstone/rebyu/controllers/DifficultyLevelController.java` | `src/main/java/com/capstone/rebyu/assessment/controller/DifficultyLevelController.java` | assessment | Assessment difficulty API. |
| `src/main/java/com/capstone/rebyu/controllers/ExamTypeController.java` | `src/main/java/com/capstone/rebyu/assessment/controller/ExamTypeController.java` | assessment | Exam type API. |
| `src/main/java/com/capstone/rebyu/controllers/ExamController.java` | `src/main/java/com/capstone/rebyu/assessment/controller/ExamController.java` | assessment | Exam API. |
| `src/main/java/com/capstone/rebyu/controllers/ExamQuestionController.java` | `src/main/java/com/capstone/rebyu/assessment/controller/ExamQuestionController.java` | assessment | Exam-question API. |
| `src/main/java/com/capstone/rebyu/controllers/ExamChoiceController.java` | `src/main/java/com/capstone/rebyu/assessment/controller/ExamChoiceController.java` | assessment | Exam-choice API. |
| `src/main/java/com/capstone/rebyu/controllers/ExamResultController.java` | `src/main/java/com/capstone/rebyu/assessment/controller/ExamResultController.java` | assessment | Scoring/result API. |
| `src/main/java/com/capstone/rebyu/controllers/LearnerExamDetailController.java` | `src/main/java/com/capstone/rebyu/assessment/controller/LearnerExamDetailController.java` | assessment | Per-question exam attempt detail. |
| `src/main/java/com/capstone/rebyu/dto/QuestionDto.java` | `src/main/java/com/capstone/rebyu/assessment/dto/QuestionDto.java` | assessment | Question DTO. |
| `src/main/java/com/capstone/rebyu/dto/QuestionTypeDto.java` | `src/main/java/com/capstone/rebyu/assessment/dto/QuestionTypeDto.java` | assessment | Question type DTO. |
| `src/main/java/com/capstone/rebyu/dto/ChoiceDto.java` | `src/main/java/com/capstone/rebyu/assessment/dto/ChoiceDto.java` | assessment | Choice DTO. |
| `src/main/java/com/capstone/rebyu/dto/NoChoiceQuestionDto.java` | `src/main/java/com/capstone/rebyu/assessment/dto/NoChoiceQuestionDto.java` | assessment | Free-answer question DTO. |
| `src/main/java/com/capstone/rebyu/dto/DifficultyLevelDto.java` | `src/main/java/com/capstone/rebyu/assessment/dto/DifficultyLevelDto.java` | assessment | Difficulty DTO. |
| `src/main/java/com/capstone/rebyu/dto/ExamTypeDto.java` | `src/main/java/com/capstone/rebyu/assessment/dto/ExamTypeDto.java` | assessment | Exam type DTO. |
| `src/main/java/com/capstone/rebyu/dto/ExamDto.java` | `src/main/java/com/capstone/rebyu/assessment/dto/ExamDto.java` | assessment | Exam DTO. |
| `src/main/java/com/capstone/rebyu/dto/ExamQuestionDto.java` | `src/main/java/com/capstone/rebyu/assessment/dto/ExamQuestionDto.java` | assessment | Exam-question DTO. |
| `src/main/java/com/capstone/rebyu/dto/ExamChoiceDto.java` | `src/main/java/com/capstone/rebyu/assessment/dto/ExamChoiceDto.java` | assessment | Exam-choice DTO. |
| `src/main/java/com/capstone/rebyu/dto/ExamResultDto.java` | `src/main/java/com/capstone/rebyu/assessment/dto/ExamResultDto.java` | assessment | Exam result DTO. |
| `src/main/java/com/capstone/rebyu/dto/LearnerExamDetailDto.java` | `src/main/java/com/capstone/rebyu/assessment/dto/LearnerExamDetailDto.java` | assessment | Per-question exam detail DTO. |
| `src/main/java/com/capstone/rebyu/mappers/QuestionMapper.java` | `src/main/java/com/capstone/rebyu/assessment/mapper/QuestionMapper.java` | assessment | Maps question entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/QuestionTypeMapper.java` | `src/main/java/com/capstone/rebyu/assessment/mapper/QuestionTypeMapper.java` | assessment | Maps question type entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/ChoiceMapper.java` | `src/main/java/com/capstone/rebyu/assessment/mapper/ChoiceMapper.java` | assessment | Maps choice entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/NoChoiceQuestionMapper.java` | `src/main/java/com/capstone/rebyu/assessment/mapper/NoChoiceQuestionMapper.java` | assessment | Maps free-answer question entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/DifficultyLevelMapper.java` | `src/main/java/com/capstone/rebyu/assessment/mapper/DifficultyLevelMapper.java` | assessment | Maps difficulty entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/ExamTypeMapper.java` | `src/main/java/com/capstone/rebyu/assessment/mapper/ExamTypeMapper.java` | assessment | Maps exam type entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/ExamMapper.java` | `src/main/java/com/capstone/rebyu/assessment/mapper/ExamMapper.java` | assessment | Maps exam entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/ExamQuestionMapper.java` | `src/main/java/com/capstone/rebyu/assessment/mapper/ExamQuestionMapper.java` | assessment | Maps exam-question entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/ExamChoiceMapper.java` | `src/main/java/com/capstone/rebyu/assessment/mapper/ExamChoiceMapper.java` | assessment | Maps exam-choice entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/ExamResultMapper.java` | `src/main/java/com/capstone/rebyu/assessment/mapper/ExamResultMapper.java` | assessment | Maps exam result entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/LearnerExamDetailMapper.java` | `src/main/java/com/capstone/rebyu/assessment/mapper/LearnerExamDetailMapper.java` | assessment | Maps exam detail entity/DTO. |
| `src/main/java/com/capstone/rebyu/models/Question.java` | `src/main/java/com/capstone/rebyu/assessment/entity/Question.java` | assessment | Question bank entity. |
| `src/main/java/com/capstone/rebyu/models/QuestionType.java` | `src/main/java/com/capstone/rebyu/assessment/entity/QuestionType.java` | assessment | Question type entity. |
| `src/main/java/com/capstone/rebyu/models/Choice.java` | `src/main/java/com/capstone/rebyu/assessment/entity/Choice.java` | assessment | Choice entity. |
| `src/main/java/com/capstone/rebyu/models/NoChoiceQuestion.java` | `src/main/java/com/capstone/rebyu/assessment/entity/NoChoiceQuestion.java` | assessment | Free-answer question entity. |
| `src/main/java/com/capstone/rebyu/models/DifficultyLevel.java` | `src/main/java/com/capstone/rebyu/assessment/entity/DifficultyLevel.java` | assessment | Difficulty entity. |
| `src/main/java/com/capstone/rebyu/models/ExamType.java` | `src/main/java/com/capstone/rebyu/assessment/entity/ExamType.java` | assessment | Exam type entity. |
| `src/main/java/com/capstone/rebyu/models/Exam.java` | `src/main/java/com/capstone/rebyu/assessment/entity/Exam.java` | assessment | Exam entity. |
| `src/main/java/com/capstone/rebyu/models/ExamQuestion.java` | `src/main/java/com/capstone/rebyu/assessment/entity/ExamQuestion.java` | assessment | Exam-question entity. |
| `src/main/java/com/capstone/rebyu/models/ExamChoice.java` | `src/main/java/com/capstone/rebyu/assessment/entity/ExamChoice.java` | assessment | Exam-choice entity. |
| `src/main/java/com/capstone/rebyu/models/ExamChoiceId.java` | `src/main/java/com/capstone/rebyu/assessment/entity/ExamChoiceId.java` | assessment | Embedded ID belongs with owning entity. |
| `src/main/java/com/capstone/rebyu/models/ExamResult.java` | `src/main/java/com/capstone/rebyu/assessment/entity/ExamResult.java` | assessment | Exam result/scoring entity. |
| `src/main/java/com/capstone/rebyu/models/ExamResultId.java` | `src/main/java/com/capstone/rebyu/assessment/entity/ExamResultId.java` | assessment | Embedded ID belongs with owning entity. |
| `src/main/java/com/capstone/rebyu/models/LearnerExamDetail.java` | `src/main/java/com/capstone/rebyu/assessment/entity/LearnerExamDetail.java` | assessment | Per-question exam attempt entity. |
| `src/main/java/com/capstone/rebyu/models/LearnerExamDetailId.java` | `src/main/java/com/capstone/rebyu/assessment/entity/LearnerExamDetailId.java` | assessment | Embedded ID belongs with owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/QuestionRepository.java` | `src/main/java/com/capstone/rebyu/assessment/repository/QuestionRepository.java` | assessment | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/QuestionTypeRepository.java` | `src/main/java/com/capstone/rebyu/assessment/repository/QuestionTypeRepository.java` | assessment | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/ChoiceRepository.java` | `src/main/java/com/capstone/rebyu/assessment/repository/ChoiceRepository.java` | assessment | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/NoChoiceQuestionRepository.java` | `src/main/java/com/capstone/rebyu/assessment/repository/NoChoiceQuestionRepository.java` | assessment | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/DifficultyLevelRepository.java` | `src/main/java/com/capstone/rebyu/assessment/repository/DifficultyLevelRepository.java` | assessment | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/ExamTypeRepository.java` | `src/main/java/com/capstone/rebyu/assessment/repository/ExamTypeRepository.java` | assessment | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/ExamRepository.java` | `src/main/java/com/capstone/rebyu/assessment/repository/ExamRepository.java` | assessment | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/ExamQuestionRepository.java` | `src/main/java/com/capstone/rebyu/assessment/repository/ExamQuestionRepository.java` | assessment | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/ExamChoiceRepository.java` | `src/main/java/com/capstone/rebyu/assessment/repository/ExamChoiceRepository.java` | assessment | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/ExamResultRepository.java` | `src/main/java/com/capstone/rebyu/assessment/repository/ExamResultRepository.java` | assessment | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/LearnerExamDetailRepository.java` | `src/main/java/com/capstone/rebyu/assessment/repository/LearnerExamDetailRepository.java` | assessment | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/services/QuestionService.java` | `src/main/java/com/capstone/rebyu/assessment/service/QuestionService.java` | assessment | Question bank service. |
| `src/main/java/com/capstone/rebyu/services/QuestionTypeService.java` | `src/main/java/com/capstone/rebyu/assessment/service/QuestionTypeService.java` | assessment | Question type service. |
| `src/main/java/com/capstone/rebyu/services/ChoiceService.java` | `src/main/java/com/capstone/rebyu/assessment/service/ChoiceService.java` | assessment | Choice service. |
| `src/main/java/com/capstone/rebyu/services/NoChoiceQuestionService.java` | `src/main/java/com/capstone/rebyu/assessment/service/NoChoiceQuestionService.java` | assessment | Free-answer question service. |
| `src/main/java/com/capstone/rebyu/services/DifficultyLevelService.java` | `src/main/java/com/capstone/rebyu/assessment/service/DifficultyLevelService.java` | assessment | Difficulty service. |
| `src/main/java/com/capstone/rebyu/services/ExamTypeService.java` | `src/main/java/com/capstone/rebyu/assessment/service/ExamTypeService.java` | assessment | Exam type service. |
| `src/main/java/com/capstone/rebyu/services/ExamService.java` | `src/main/java/com/capstone/rebyu/assessment/service/ExamService.java` | assessment | Exam service. |
| `src/main/java/com/capstone/rebyu/services/ExamQuestionService.java` | `src/main/java/com/capstone/rebyu/assessment/service/ExamQuestionService.java` | assessment | Exam-question service. |
| `src/main/java/com/capstone/rebyu/services/ExamChoiceService.java` | `src/main/java/com/capstone/rebyu/assessment/service/ExamChoiceService.java` | assessment | Exam-choice service. |
| `src/main/java/com/capstone/rebyu/services/ExamResultService.java` | `src/main/java/com/capstone/rebyu/assessment/service/ExamResultService.java` | assessment | Exam result service. |
| `src/main/java/com/capstone/rebyu/services/LearnerExamDetailService.java` | `src/main/java/com/capstone/rebyu/assessment/service/LearnerExamDetailService.java` | assessment | Per-question exam detail service. |
| `src/main/java/com/capstone/rebyu/controllers/AchievementController.java` | `src/main/java/com/capstone/rebyu/progress/controller/AchievementController.java` | progress | Achievement/progress feature API. |
| `src/main/java/com/capstone/rebyu/controllers/ActivityLogController.java` | `src/main/java/com/capstone/rebyu/progress/controller/ActivityLogController.java` | progress | Activity/progress tracking API. |
| `src/main/java/com/capstone/rebyu/controllers/ActivityTypeController.java` | `src/main/java/com/capstone/rebyu/progress/controller/ActivityTypeController.java` | progress | Activity taxonomy for progress logs. |
| `src/main/java/com/capstone/rebyu/controllers/LearnerAchievementController.java` | `src/main/java/com/capstone/rebyu/progress/controller/LearnerAchievementController.java` | progress | Learner achievement progress API. |
| `src/main/java/com/capstone/rebyu/controllers/LearnerCompletedLessonController.java` | `src/main/java/com/capstone/rebyu/progress/controller/LearnerCompletedLessonController.java` | progress | Completed lesson progress API. |
| `src/main/java/com/capstone/rebyu/controllers/LearnerLessonMasteryController.java` | `src/main/java/com/capstone/rebyu/progress/controller/LearnerLessonMasteryController.java` | progress | Mastery/progress API. |
| `src/main/java/com/capstone/rebyu/controllers/WeakAreaController.java` | `src/main/java/com/capstone/rebyu/progress/controller/WeakAreaController.java` | progress | Learner weak-area progress API. |
| `src/main/java/com/capstone/rebyu/dto/AchievementDto.java` | `src/main/java/com/capstone/rebyu/progress/dto/AchievementDto.java` | progress | Achievement DTO. |
| `src/main/java/com/capstone/rebyu/dto/ActivityLogDto.java` | `src/main/java/com/capstone/rebyu/progress/dto/ActivityLogDto.java` | progress | Activity log DTO. |
| `src/main/java/com/capstone/rebyu/dto/ActivityTypeDto.java` | `src/main/java/com/capstone/rebyu/progress/dto/ActivityTypeDto.java` | progress | Activity type DTO. |
| `src/main/java/com/capstone/rebyu/dto/LearnerAchievementDto.java` | `src/main/java/com/capstone/rebyu/progress/dto/LearnerAchievementDto.java` | progress | Learner achievement DTO. |
| `src/main/java/com/capstone/rebyu/dto/LearnerCompletedLessonDto.java` | `src/main/java/com/capstone/rebyu/progress/dto/LearnerCompletedLessonDto.java` | progress | Completed lesson DTO. |
| `src/main/java/com/capstone/rebyu/dto/LearnerLessonMasteryDto.java` | `src/main/java/com/capstone/rebyu/progress/dto/LearnerLessonMasteryDto.java` | progress | Mastery DTO. |
| `src/main/java/com/capstone/rebyu/dto/WeakAreaDto.java` | `src/main/java/com/capstone/rebyu/progress/dto/WeakAreaDto.java` | progress | Weak-area DTO. |
| `src/main/java/com/capstone/rebyu/mappers/AchievementMapper.java` | `src/main/java/com/capstone/rebyu/progress/mapper/AchievementMapper.java` | progress | Maps achievement entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/ActivityLogMapper.java` | `src/main/java/com/capstone/rebyu/progress/mapper/ActivityLogMapper.java` | progress | Maps activity log entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/ActivityTypeMapper.java` | `src/main/java/com/capstone/rebyu/progress/mapper/ActivityTypeMapper.java` | progress | Maps activity type entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/LearnerAchievementMapper.java` | `src/main/java/com/capstone/rebyu/progress/mapper/LearnerAchievementMapper.java` | progress | Maps learner achievement entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/LearnerCompletedLessonMapper.java` | `src/main/java/com/capstone/rebyu/progress/mapper/LearnerCompletedLessonMapper.java` | progress | Maps completed lesson entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/LearnerLessonMasteryMapper.java` | `src/main/java/com/capstone/rebyu/progress/mapper/LearnerLessonMasteryMapper.java` | progress | Maps learner mastery entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/WeakAreaMapper.java` | `src/main/java/com/capstone/rebyu/progress/mapper/WeakAreaMapper.java` | progress | Maps weak-area entity/DTO. |
| `src/main/java/com/capstone/rebyu/models/Achievement.java` | `src/main/java/com/capstone/rebyu/progress/entity/Achievement.java` | progress | Achievement/progress entity. |
| `src/main/java/com/capstone/rebyu/models/ActivityLog.java` | `src/main/java/com/capstone/rebyu/progress/entity/ActivityLog.java` | progress | Activity/progress log entity. |
| `src/main/java/com/capstone/rebyu/models/ActivityType.java` | `src/main/java/com/capstone/rebyu/progress/entity/ActivityType.java` | progress | Activity/progress taxonomy entity. |
| `src/main/java/com/capstone/rebyu/models/LearnerAchievement.java` | `src/main/java/com/capstone/rebyu/progress/entity/LearnerAchievement.java` | progress | Learner achievement progress entity. |
| `src/main/java/com/capstone/rebyu/models/LearnerAchievementId.java` | `src/main/java/com/capstone/rebyu/progress/entity/LearnerAchievementId.java` | progress | Embedded ID belongs with owning entity. |
| `src/main/java/com/capstone/rebyu/models/LearnerCompletedLesson.java` | `src/main/java/com/capstone/rebyu/progress/entity/LearnerCompletedLesson.java` | progress | Completed lesson progress entity. |
| `src/main/java/com/capstone/rebyu/models/LearnerCompletedLessonId.java` | `src/main/java/com/capstone/rebyu/progress/entity/LearnerCompletedLessonId.java` | progress | Embedded ID belongs with owning entity. |
| `src/main/java/com/capstone/rebyu/models/LearnerLessonMastery.java` | `src/main/java/com/capstone/rebyu/progress/entity/LearnerLessonMastery.java` | progress | Learner mastery/progress entity. |
| `src/main/java/com/capstone/rebyu/models/LearnerLessonMasteryId.java` | `src/main/java/com/capstone/rebyu/progress/entity/LearnerLessonMasteryId.java` | progress | Embedded ID belongs with owning entity. |
| `src/main/java/com/capstone/rebyu/models/WeakArea.java` | `src/main/java/com/capstone/rebyu/progress/entity/WeakArea.java` | progress | Learner weak-area progress entity. |
| `src/main/java/com/capstone/rebyu/models/WeakAreaId.java` | `src/main/java/com/capstone/rebyu/progress/entity/WeakAreaId.java` | progress | Embedded ID belongs with owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/AchievementRepository.java` | `src/main/java/com/capstone/rebyu/progress/repository/AchievementRepository.java` | progress | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/ActivityLogRepository.java` | `src/main/java/com/capstone/rebyu/progress/repository/ActivityLogRepository.java` | progress | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/ActivityTypeRepository.java` | `src/main/java/com/capstone/rebyu/progress/repository/ActivityTypeRepository.java` | progress | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/LearnerAchievementRepository.java` | `src/main/java/com/capstone/rebyu/progress/repository/LearnerAchievementRepository.java` | progress | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/LearnerCompletedLessonRepository.java` | `src/main/java/com/capstone/rebyu/progress/repository/LearnerCompletedLessonRepository.java` | progress | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/LearnerLessonMasteryRepository.java` | `src/main/java/com/capstone/rebyu/progress/repository/LearnerLessonMasteryRepository.java` | progress | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/WeakAreaRepository.java` | `src/main/java/com/capstone/rebyu/progress/repository/WeakAreaRepository.java` | progress | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/services/AchievementService.java` | `src/main/java/com/capstone/rebyu/progress/service/AchievementService.java` | progress | Achievement/progress service. |
| `src/main/java/com/capstone/rebyu/services/ActivityLogService.java` | `src/main/java/com/capstone/rebyu/progress/service/ActivityLogService.java` | progress | Activity/progress service. |
| `src/main/java/com/capstone/rebyu/services/ActivityTypeService.java` | `src/main/java/com/capstone/rebyu/progress/service/ActivityTypeService.java` | progress | Activity taxonomy service. |
| `src/main/java/com/capstone/rebyu/services/LearnerAchievementService.java` | `src/main/java/com/capstone/rebyu/progress/service/LearnerAchievementService.java` | progress | Learner achievement service. |
| `src/main/java/com/capstone/rebyu/services/LearnerCompletedLessonService.java` | `src/main/java/com/capstone/rebyu/progress/service/LearnerCompletedLessonService.java` | progress | Completed lesson service. |
| `src/main/java/com/capstone/rebyu/services/LearnerLessonMasteryService.java` | `src/main/java/com/capstone/rebyu/progress/service/LearnerLessonMasteryService.java` | progress | Learner mastery service. |
| `src/main/java/com/capstone/rebyu/services/WeakAreaService.java` | `src/main/java/com/capstone/rebyu/progress/service/WeakAreaService.java` | progress | Weak-area service. |
| `src/main/java/com/capstone/rebyu/controllers/ChallengeModeController.java` | `src/main/java/com/capstone/rebyu/challenge/controller/ChallengeModeController.java` | challenge | Challenge mode API. |
| `src/main/java/com/capstone/rebyu/controllers/ChallengeSessionController.java` | `src/main/java/com/capstone/rebyu/challenge/controller/ChallengeSessionController.java` | challenge | Challenge attempt/session API. |
| `src/main/java/com/capstone/rebyu/dto/ChallengeModeDto.java` | `src/main/java/com/capstone/rebyu/challenge/dto/ChallengeModeDto.java` | challenge | Challenge mode DTO. |
| `src/main/java/com/capstone/rebyu/dto/ChallengeSessionDto.java` | `src/main/java/com/capstone/rebyu/challenge/dto/ChallengeSessionDto.java` | challenge | Challenge session DTO. |
| `src/main/java/com/capstone/rebyu/mappers/ChallengeModeMapper.java` | `src/main/java/com/capstone/rebyu/challenge/mapper/ChallengeModeMapper.java` | challenge | Maps challenge mode entity/DTO. |
| `src/main/java/com/capstone/rebyu/mappers/ChallengeSessionMapper.java` | `src/main/java/com/capstone/rebyu/challenge/mapper/ChallengeSessionMapper.java` | challenge | Maps challenge session entity/DTO. |
| `src/main/java/com/capstone/rebyu/models/ChallengeMode.java` | `src/main/java/com/capstone/rebyu/challenge/entity/ChallengeMode.java` | challenge | Challenge mode entity. |
| `src/main/java/com/capstone/rebyu/models/ChallengeSession.java` | `src/main/java/com/capstone/rebyu/challenge/entity/ChallengeSession.java` | challenge | Challenge attempt/session entity. |
| `src/main/java/com/capstone/rebyu/repositories/ChallengeModeRepository.java` | `src/main/java/com/capstone/rebyu/challenge/repository/ChallengeModeRepository.java` | challenge | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/repositories/ChallengeSessionRepository.java` | `src/main/java/com/capstone/rebyu/challenge/repository/ChallengeSessionRepository.java` | challenge | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/services/ChallengeModeService.java` | `src/main/java/com/capstone/rebyu/challenge/service/ChallengeModeService.java` | challenge | Challenge mode service. |
| `src/main/java/com/capstone/rebyu/services/ChallengeSessionService.java` | `src/main/java/com/capstone/rebyu/challenge/service/ChallengeSessionService.java` | challenge | Challenge session service. |
| `src/main/java/com/capstone/rebyu/controllers/LearnerInvitationController.java` | `src/main/java/com/capstone/rebyu/notification/controller/LearnerInvitationController.java` | notification | Email invitation/reminder domain. |
| `src/main/java/com/capstone/rebyu/dto/LearnerInvitationDto.java` | `src/main/java/com/capstone/rebyu/notification/dto/LearnerInvitationDto.java` | notification | Email invitation DTO. |
| `src/main/java/com/capstone/rebyu/mappers/LearnerInvitationMapper.java` | `src/main/java/com/capstone/rebyu/notification/mapper/LearnerInvitationMapper.java` | notification | Maps invitation entity/DTO. |
| `src/main/java/com/capstone/rebyu/models/LearnerInvitation.java` | `src/main/java/com/capstone/rebyu/notification/entity/LearnerInvitation.java` | notification | Email invitation entity. |
| `src/main/java/com/capstone/rebyu/repositories/LearnerInvitationRepository.java` | `src/main/java/com/capstone/rebyu/notification/repository/LearnerInvitationRepository.java` | notification | Repository follows owning entity. |
| `src/main/java/com/capstone/rebyu/services/LearnerInvitationService.java` | `src/main/java/com/capstone/rebyu/notification/service/LearnerInvitationService.java` | notification | Email invitation service. |

Files that should stay in place:

| Current File Path | New File Path | Module Owner | Reason |
|---|---|---|---|
| `src/main/java/com/capstone/rebyu/RebyuApplication.java` | `src/main/java/com/capstone/rebyu/RebyuApplication.java` | application root | Root `@SpringBootApplication`; keeping it at `com.capstone.rebyu` preserves component/entity/repository scanning for all modules. |
| `src/main/resources/application.yaml` | `src/main/resources/application.yaml` | application root | Runtime configuration, not a Java module file. |
| `src/test/java/com/capstone/rebyu/RebyuApplicationTests.java` | `src/test/java/com/capstone/rebyu/RebyuApplicationTests.java` | application root test | Whole-application context smoke test. |

## 5. Suspected Circular Dependencies

No current service-to-service circular injection was found. Most services inject only their own repository and mapper. `S3StorageService` injects `LessonImageService` and `LessonVideoService`, both lesson-owned, so it should move with the lesson module.

Likely circular or high-coupling areas after package splitting:

- `certification` <-> `lesson`: `Certification` -> `MajorCategory` -> `MiddleCategory` -> `Lesson`, and `Lesson` -> `MiddleCategory`. This is an entity/model cycle already present through JPA relationships.
- `certification.mapper` -> `lesson.mapper`: `CertificationMapper` uses `MajorCategoryMapper`, `MajorCategoryMapper` uses `MiddleCategoryMapper`, and `MiddleCategoryMapper` uses `LessonMapper`.
- `assessment` -> `lesson` and `certification`: `Question` and `LearnerExamDetail` reference `Lesson`; `Exam` references `Certification`.
- `assessment` -> `user`: `ExamResult` and `LearnerExamDetail` reference `Learner`.
- `progress` -> `user` and `lesson`: progress entities reference `Learner`, `User`, and `Lesson`.
- `challenge` -> `user`: `ChallengeSession` references `Learner`.
- `enrollment` -> `user`, `certification`, and `organization`: learner certification and organization learner assignment entities reference those modules.
- `partnership` -> `organization` and `certification`: requests reference `Enterprise` and requested `Certification`.
- `notification` -> `organization`, `certification`, and `user`: `LearnerInvitation` references `Enterprise`, `Certification`, and `Learner`.

These are primarily JPA entity relationship dependencies, not deployment boundaries. During refactor, imports must be explicit and services should avoid adding new cross-module repository injections.

## 6. Files That Should Remain In `common`

- `common/config/CorsConfig.java`
- `common/config/S3Config.java`
- `common/security/SecurityConfig.java`
- `common/util/JsonStringDeserializer.java`

Do not move business entities into `common`.

## 7. Potential Import / Package Issues

- Every moved Java file needs its `package` declaration changed from `com.capstone.rebyu.controllers`, `dto`, `mappers`, `models`, `repositories`, `services`, `config`, or `utils` to the target module package.
- Repository interfaces currently import entities from `com.capstone.rebyu.models.*`; each must import the new owning `*.entity.*` class.
- Services currently import `com.capstone.rebyu.dto.*`, `mappers.*`, `models.*`, and `repositories.*`; those imports must be updated module by module.
- Controllers currently import `com.capstone.rebyu.dto.*` and `services.*`; those imports must be updated module by module while preserving all `@RequestMapping` paths.
- Entity references are currently same-package references inside `models`; after splitting modules, many JPA relationship fields will need explicit imports across module packages.
- Embedded ID classes must move with the entity that owns them, and repository generic types must follow the moved ID class package.
- MapStruct `uses` references must be updated:
  - `CertificationMapper` uses `MajorCategoryMapper`.
  - `MajorCategoryMapper` uses `MiddleCategoryMapper`.
  - `MiddleCategoryMapper` uses `LessonMapper`, which becomes a cross-module mapper dependency.
- `JsonStringDeserializer` import in `Lesson` must change to `com.capstone.rebyu.common.util.JsonStringDeserializer`.
- `S3StorageService`, `FileController`, and `FileDto` are planned under `lesson` because upload currently persists lesson image/video metadata. If later file storage becomes truly shared, introduce a narrow common storage service and keep lesson media persistence in lesson.
- `CustomUserService` is not annotated with `@Service` and currently returns `null`; moving it to auth will not change behavior, but its incomplete implementation is technical debt.
- `S3Config` currently has no Spring annotations or bean methods; moving it to common preserves current behavior but does not create an `S3Client`.
- `SecurityConfig` currently permits only `/api/certifications/**` and requires authentication for all other routes. No JWT decoder/custom JWT config class was found in Java; OAuth2 resource server configuration is commented out in `application.yaml`.
- Root `RebyuApplication` should stay at `com.capstone.rebyu` so Spring Boot scans all module packages without adding `@ComponentScan`, `@EntityScan`, or `@EnableJpaRepositories`.
- Package names should use singular folders matching the target shape: `controller`, `service`, `repository`, `entity`, `dto`, `mapper`.

## 8. Build / Test Configuration And Verification Commands

Build tool: Maven wrapper.

Java and framework:
- `pom.xml` property: `java.version=21`
- Maven runtime observed from `.\mvnw.cmd -v`: Java `25.0.3`
- Spring Boot parent: `4.1.0`
- Spring Cloud BOM: `2025.1.2`
- MapStruct: `1.6.3`
- Lombok/MapStruct binding: `0.2.0`

JPA:
- Dependency: `spring-boot-starter-data-jpa`
- Database: PostgreSQL driver runtime dependency.
- `application.yaml`: `${DB_URL}`, `${DB_USERNAME}`, `${DB_PASSWORD}`, `org.postgresql.Driver`.
- Hibernate `ddl-auto: update`, `default_schema: public`.
- No explicit `@EntityScan` or `@EnableJpaRepositories`; root package scanning is used.

Security/JWT:
- Dependencies: `spring-boot-starter-security`, `spring-boot-starter-security-oauth2-resource-server`.
- Java config: `SecurityConfig` disables CSRF, enables CORS, permits `/api/certifications/**`, authenticates all other requests.
- YAML OAuth2 resource server JWT config is present but commented out.

MapStruct:
- Mappers use `@Mapper(componentModel = "spring")`.
- Annotation processor paths are configured for Lombok, MapStruct processor, and Lombok/MapStruct binding in `maven-compiler-plugin`.

Tests:
- Current test structure has one context smoke test: `src/test/java/com/capstone/rebyu/RebyuApplicationTests.java`.

Exact verification commands for this Windows workspace:

```powershell
.\mvnw.cmd clean compile
.\mvnw.cmd test
```

Equivalent POSIX commands if running from Git Bash/WSL:

```bash
./mvnw clean compile
./mvnw test
```

## 9. Recommended Batch Order

### Batch 1: auth, user, common security/config

- Move `SecurityConfig`, `CorsConfig`, `S3Config`, and `JsonStringDeserializer`.
- Move `CustomUserService`.
- Move `User`, `UserType`, `Learner` and their controllers, DTOs, mappers, repositories, services.
- Update imports in any remaining modules that reference `User`, `UserType`, or `Learner`.
- Compile and test.

### Batch 2: certification, lesson

- Move certification/category files.
- Move lesson, lesson media, upload DTO/controller, and S3 storage service.
- Update mapper chain imports across `certification.mapper` and `lesson.mapper`.
- Update `Lesson` import for `JsonStringDeserializer`.
- Compile and test.

### Batch 3: assessment, progress

- Move question/exam/scoring files into `assessment`.
- Move achievements, activity logs, completed lessons, mastery, weak areas into `progress`.
- Update entity imports to user, lesson, and certification packages.
- Compile and test.

### Batch 4: organization, partnership, enrollment

- Move enterprise/organization certificate files into `organization`.
- Move partnership request/item/meeting files into `partnership`.
- Move learner certification and organization certification learner assignment files into `enrollment`.
- Update entity imports to organization, certification, and user packages.
- Compile and test.

### Batch 5: challenge, notification, analytics

- Move challenge mode/session files into `challenge`.
- Move learner invitation files into `notification`.
- Analytics currently has no Java implementation to move; create no empty analytics folders unless new analytics code is introduced.
- Compile and test.

## Stop Point

Stop after this plan and wait for approval before Phase 2. Do not move files until the plan is approved.
