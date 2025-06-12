package com.hotel.service;

import com.hotel.dto.BranchRoomStatsDTO;
import com.hotel.model.Branch;
import com.hotel.repository.BranchRepository;
import com.hotel.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BranchService {

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private RoomRepository roomRepository;

    // ✅ Used by /api/branch/all
    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    // ✅ Used by /api/branch/{id}
    public Branch getBranchById(Long id) {
        Optional<Branch> branchOpt = branchRepository.findById(id);
        return branchOpt.orElse(null);
    }

    // ✅ Used by POST /api/branch/add
    public Branch saveBranch(Branch branch) {
        return branchRepository.save(branch);
    }

    // ✅ Used by DELETE /api/branch/{id}
    public void deleteBranch(Long id) {
        branchRepository.deleteById(id);
    }

    // ✅ Used by BookingController for branch room stats
    public List<BranchRoomStatsDTO> getBranchRoomStats() {
        List<Object[]> rawStats = roomRepository.fetchBranchRoomStatsRaw();

        return rawStats.stream().map(row -> {
            Long branchId = ((Number) row[0]).longValue();
            String branchName = (String) row[1];
            int luxury = ((Number) row[2]).intValue();
            int deluxe = ((Number) row[3]).intValue();
            int standard = ((Number) row[4]).intValue();
            return new BranchRoomStatsDTO(branchId, branchName, luxury, deluxe, standard);
        }).collect(Collectors.toList());
    }
}
