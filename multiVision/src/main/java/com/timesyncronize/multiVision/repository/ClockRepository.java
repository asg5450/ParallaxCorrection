package com.timesyncronize.multiVision.repository;

import com.timesyncronize.multiVision.model.Clock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ClockRepository extends CrudRepository<Clock, Long> {
    @Query(value = "select now(3)", nativeQuery = true)
    LocalDateTime now();
}
