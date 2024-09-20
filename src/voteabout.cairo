#[starknet::contract]
mod VoteAbout {
    use starknet::{ContractAddress, get_caller_address};
    use core::starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess
    };

    #[storage]
    struct Storage {
        votes: Map<u32, VoteNode>,
        vote_count: u32,
    }

    #[starknet::storage_node]
    struct VoteNode {
        title: felt252,
        description: felt252,
        candidates: Map<u32, Map<felt252, u32>>, // <candidateId <candidate name, vote count>>
        candidates_count: u32,
        voters: Map<ContractAddress, bool>,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.vote_count.write(0);
    }

    #[external(v0)]
    fn create_vote(ref self: ContractState, title: felt252, description: felt252) -> u32 {
        let mut vote_count = self.vote_count.read();
        let new_vote_id = vote_count + 1;

        let mut vote = self.votes.entry(new_vote_id);
        vote.title.write(title);
        vote.description.write(description);
        vote.candidates_count.write(0);
        self.vote_count.write(new_vote_id);
        new_vote_id
    }

    #[external(v0)]
    fn add_candidate(ref self: ContractState, vote_id: u32, candidateId: u32, candidate_name: felt252) {
        let mut vote = self.votes.entry(vote_id);
        vote.candidates.entry(candidateId).entry(candidate_name).write(0);
        vote.candidates_count.write(vote.candidates_count.read() + 1);

    }

    #[external(v0)]
    fn get_canditate_count(self: @ContractState, vote_id: u32) -> u32 {
        let vote = self.votes.entry(vote_id);
        vote.candidates_count.read()
    }

    #[external(v0)]
    fn vote(ref self: ContractState, vote_id: u32, vote: bool) {
        let mut vote = self.votes.entry(vote_id);
        let caller = get_caller_address();
        let has_voted = vote.voters.entry(caller).read();
        if has_voted {
            return;
        }
        vote.voters.entry(caller).write(true);
    }

    #[external(v0)]
    fn get_vote_details(self: @ContractState, vote_id: u32) -> (felt252, felt252, ) {
        let vote = self.votes.entry(vote_id);
        (
            vote.title.read(),
            vote.description.read(),
        )
    }

    #[external(v0)]
    fn get_voter_has_voted(self: @ContractState, vote_id: u32) -> (ContractAddress, bool) {
        let vote = self.votes.entry(vote_id);
        let caller = get_caller_address();
        (caller, vote.voters.entry(caller).read())
    }

    #[external(v0)]
    fn get_vote_count(self: @ContractState,) -> u32 {
        self.vote_count.read()
    }

}
