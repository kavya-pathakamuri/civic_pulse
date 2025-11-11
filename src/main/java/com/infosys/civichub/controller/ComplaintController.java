package com.infosys.civichub.controller;

import com.infosys.civichub.model.Complaint;
import com.infosys.civichub.repo.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    private final String uploadDir = "uploads/";

    @PostMapping
    public Complaint createComplaint(
            @RequestParam String grievanceId,
            @RequestParam String email,
            @RequestParam String title,
            @RequestParam String category,
            @RequestParam String location,
            @RequestParam String description,
            @RequestParam String status,
            @RequestParam(required = false) MultipartFile file) throws IOException {

        Complaint complaint = new Complaint();
        complaint.setGrievanceId(grievanceId);
        complaint.setEmail(email);
        complaint.setTitle(title);
        complaint.setCategory(category);
        complaint.setLocation(location);
        complaint.setDescription(description);
        complaint.setStatus(status);

        if (file != null && !file.isEmpty()) {
            File dir = new File(uploadDir);
            if (!dir.exists())
                dir.mkdirs();

            String filePath = uploadDir + file.getOriginalFilename();
            file.transferTo(new File(filePath));
            complaint.setFileName(file.getOriginalFilename());
        }

        return complaintRepository.save(complaint);
    }

    @GetMapping("/{grievanceId}")
    public Complaint getComplaint(@PathVariable String grievanceId) {
        Optional<Complaint> complaint = complaintRepository.findByGrievanceId(grievanceId);
        return complaint.orElse(null);
    }
}
