package com.techstore.repository;

import com.techstore.model.Nosotros;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NosotrosRepository extends JpaRepository<Nosotros, Long> {
}
