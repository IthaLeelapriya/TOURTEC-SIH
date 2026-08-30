package com.tourtec.repository;

import com.tourtec.entity.ZoneEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZoneRepository extends JpaRepository<ZoneEntity, String> {
    List<ZoneEntity> findByDestinationId(String destinationId);
}
