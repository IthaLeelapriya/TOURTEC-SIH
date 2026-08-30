package com.tourtec.repository;

import com.tourtec.entity.SosLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SosLogRepository extends JpaRepository<SosLogEntity, String> {
}
