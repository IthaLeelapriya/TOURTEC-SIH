package com.tourtec.repository;

import com.tourtec.entity.DestinationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DestinationRepository extends JpaRepository<DestinationEntity, String> {
}
