package com.capstone.rebyu.learningtools;

import com.capstone.rebyu.auth.dto.CurrentUserDto;
import com.capstone.rebyu.auth.service.CognitoAuthService;
import com.capstone.rebyu.ai.dto.ChatRequest;
import com.capstone.rebyu.ai.service.AiChatService;
import com.capstone.rebyu.billing.entitlement.PremiumAccessRequiredException;
import com.capstone.rebyu.billing.service.LearnerEntitlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/learner-tools")
@RequiredArgsConstructor
public class LearnerToolsController {
    private final LearnerToolsService service;
    private final CognitoAuthService auth;
    private final AiChatService aiChatService;
    private final LearnerEntitlementService entitlementService;
    public record StudyAidRequest(String type, String lessonName, Long lessonId) {}
    @GetMapping("/library") public List<LearnerToolsService.LibraryItem> library(@AuthenticationPrincipal Jwt jwt){return service.library(me(jwt));}
    @PostMapping("/library") @ResponseStatus(HttpStatus.CREATED) public LearnerToolsService.LibraryItem add(@AuthenticationPrincipal Jwt jwt,@RequestBody LearnerToolsService.LibraryRequest request){return service.createLibraryItem(me(jwt),request);}
    @DeleteMapping("/library/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@AuthenticationPrincipal Jwt jwt,@PathVariable Long id){service.deleteLibraryItem(me(jwt),id);}
    @GetMapping("/mistakes") public List<LearnerToolsService.Mistake> mistakes(@AuthenticationPrincipal Jwt jwt){return service.mistakes(me(jwt));}
    @PutMapping("/mistakes/{questionId}/reviewed") public Map<String,Boolean> reviewed(@AuthenticationPrincipal Jwt jwt,@PathVariable Long questionId,@RequestBody Map<String,Boolean> body){boolean reviewed=body.getOrDefault("reviewed",true);service.markReviewed(me(jwt),questionId,reviewed);return Map.of("reviewed",reviewed);}
    @PostMapping("/library/generate") @ResponseStatus(HttpStatus.CREATED)
    public LearnerToolsService.LibraryItem generate(@AuthenticationPrincipal Jwt jwt,@RequestBody StudyAidRequest request){
        Long learnerId=me(jwt);
        if(!entitlementService.hasActiveProSubscription(learnerId)) throw new PremiumAccessRequiredException("AI_STUDY_AID_GENERATION",true);
        String type=request.type()==null?"":request.type().toLowerCase();
        if(!List.of("quiz","flashcard").contains(type)) throw new IllegalArgumentException("Generate either a quiz or flashcards");
        String lesson=request.lessonName()==null||request.lessonName().isBlank()?"this lesson":request.lessonName().trim();
        String instruction="quiz".equals(type)
                ? "Create a five-question multiple-choice practice quiz for this lesson. Include four choices per question, then put an answer key with short explanations at the end."
                : "Create ten concise study flashcards for this lesson. Format every card as Front: question or term, then Back: answer or explanation.";
        var response=aiChatService.chat(new ChatRequest(instruction,"study-aid-"+learnerId+"-"+System.nanoTime(),lesson));
        String title=("quiz".equals(type)?"Practice Quiz: ":"Flashcards: ")+lesson;
        return service.createLibraryItem(learnerId,new LearnerToolsService.LibraryRequest(type,title,response.getReply(),null,null,request.lessonId()));
    }
    private Long me(Jwt jwt){if(jwt==null)throw new IllegalArgumentException("Authentication is required");CurrentUserDto u=auth.syncCurrentUser(jwt,jwt.getTokenValue());if(u.learnerId()==null)throw new IllegalArgumentException("A learner account is required");return u.learnerId();}
}
