package com.infosys.civichub.repo;

import com.infosys.civichub.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Optional<Complaint> findByGrievanceId(String grievanceId);
}
