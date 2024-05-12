package com.timesyncronize.syncclock.repository;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.SQLException;

@AllArgsConstructor
@Repository
public class ClockRepository {

    @Autowired
    private final JdbcTemplate jdbcTemplate;


}
