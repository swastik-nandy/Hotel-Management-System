package com.hotel.controller;

import com.hotel.model.Branch;
import com.hotel.service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branch")
public class BranchController {

    @Autowired
    private BranchService branchService;

    //  Used by RoomFilter page to get all branch options
    @GetMapping("/all")
    public List<Branch> getAllBranches() {
        return branchService.getAllBranches();
    }

    //  Fetch a single branch by ID (optional, helpful for BookingPage if needed)
    @GetMapping("/{id}")
    public ResponseEntity<Branch> getBranchById(@PathVariable Long id) {
        Branch branch = branchService.getBranchById(id);
        return branch != null ? ResponseEntity.ok(branch) : ResponseEntity.notFound().build();
    }

    //  Admin feature: add a new branch (not used by frontend yet)
    @PostMapping("/add")
    public ResponseEntity<Branch> addBranch(@RequestBody Branch branch) {
        Branch saved = branchService.saveBranch(branch);
        return ResponseEntity.ok(saved);
    }

    //  Admin feature: delete a branch (not used by frontend yet)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBranch(@PathVariable Long id) {
        branchService.deleteBranch(id);
        return ResponseEntity.noContent().build();
    }
}
