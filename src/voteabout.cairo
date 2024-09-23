#[starknet::interface]
trait IVoteAbout<TContractState> {
    fn create_vote(ref self: TContractState, title: felt252, description: felt252, candidates: Map<u32, felt252>, voting_period: u64) -> u32;

    // function arguments now parsed in create_vote
    //fn add_candidate(
    //    ref self: TContractState, vote_id: u32, candidateId: u32, candidate_name: felt252
   // );

    fn get_candidate_count(self: @TContractState, vote_id: u32) -> u32;

    fn vote(ref self: TContractState, vote_id: u32, candidate_id: u32);

    fn get_vote_details(self: @TContractState, vote_id: u32) -> (felt252, felt252, u64);

    //fn get_voter_has_voted(self: @TContractState, vote_id: u32) -> (ContractAddress, bool);

    fn get_vote_count(self: @TContractState,) -> u32;
    fn get_vote_results(self: @TContractState, vote_id: u32) -> Map<u32, (felt252, u32)>;
    fn is_voting_active(self: @TContractState, vote_id: u32) -> bool;
}

#[starknet::contract]
mod VoteAbout {
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use core::starknet::event::EventEmitter;
    use core::starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess
    };
    use OwnableComponent::InternalTrait;
    use openzeppelin::access::ownable::OwnableComponent;
    //use core::starknet::event::EventEmitter; used twice

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl InternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        votes: Map<u32, VoteNode>,
        vote_count: u32,
        
        #[substorage(v0)]
        ownable: OwnableComponent::Storage
    }

    #[starknet::storage_node]
    struct VoteNode {
        title: felt252,
        description: felt252,
        candidates: Map<u32, (felt252, u32)>, // <candidateId <candidate name, vote count>>
        candidates_count: u32,
        voters: Map<ContractAddress, bool>,
        voting_end_time: u64,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        VoteCast: VoteCast,
        VoteCreated: VoteCreated,
        #[flat]
        OwnableEvent: OwnableComponent::Event   

    }

    #[derive(Drop, starknet::Event)]
    struct VoteCreated {
        #[key]
        vote_id: u32,
        title: felt252,
        description: felt252,
        voting_end_time: u64,
    }
    #[derive(Drop, starknet::Event)]
    struct VoteCast {
        #[key]
        vote_id: u32,
        voter: ContractAddress,
        candidate_id: u32,
    }

    #[constructor]
    fn constructor(ref self: ContractState, initial_owner: ContractAddress) {
        self.vote_count.write(0);
        self.ownable.initializer(initial_owner)
    }

    #[abi(embed_v0)]
    impl IVoteAboutImpl of super::IVoteAbout<ContractState> {
        #[derive(Drop, starknet::Event)]
        fn create_vote(ref self: ContractState, title: felt252, description: felt252, candidates: Map<u32, felt252>, voting_period: u64) -> u32 {
            let mut vote_count = self.vote_count.read();
            let new_vote_id = vote_count + 1;
            let mut vote = self.votes.entry(new_vote_id);
            vote.candidates_count.write(0);
            vote.title.write(title);
            vote.description.write(description);

            let candidate_count = self.add_candidates(new_vote_id, candidates);
            vote.candidates_count.write(candidate_count);

            let current_time = get_block_timestamp();
            let voting_end_time = current_time + voting_period;
            vote.voting_end_time.write(voting_end_time);

            //vote.candidates_count.write(0);
            self.vote_count.write(new_vote_id);

            self.emit(Event::VoteCreated(VoteCreated {
                vote_id: new_vote_id,
                title: title,
                description: description,
                voting_end_time: voting_end_time,
            }));
            new_vote_id
        }

        // fn add_candidate implemented outside the exposed interface
        //fn add_candidate(
        //    ref self: ContractState, vote_id: u32, candidateId: u32, candidate_name: felt252
        //) {
        //    let mut vote = self.votes.entry(vote_id);
        //    vote.candidates.entry(candidateId).entry(candidate_name).write(0);
        //    vote.candidates_count.write(vote.candidates_count.read() + 1);
        //}

        fn get_candidate_count(self: @ContractState, vote_id: u32) -> u32 {
            let vote = self.votes.entry(vote_id);
            vote.candidates_count.read()
        }

        fn vote(ref self: ContractState, vote_id: u32, candidate_id: u32) {
            let mut vote = self.votes.entry(vote_id);
            let caller = get_caller_address();
            let has_voted = vote.voters.entry(caller).read();
            assert!(!has_voted, "Caller has already voted."); 

            let current_time = get_block_timestamp();
            let voting_end_time = vote.voting_end_time.read();
            assert!(current_time <= voting_end_time, "Voting period has ended.");

            let mut candidate = vote.candidates.entry(candidate_id);
            let (candidate_name, current_votes) = candidate.read();
            candidate.write(candidate_name, current_votes + 1);

            vote.voters.entry(caller).write(true);

            self.emit(Event::VoteCast(VoteCast{
                vote_id: vote_id,
                voter:caller,
                candidate_id: candidate_id,
            }));
        }

        fn get_vote_details(self: @ContractState, vote_id: u32) -> (felt252, felt252, u64) {
            let vote = self.votes.entry(vote_id);
            (vote.title.read(), vote.description.read(),vote.voting_end_time.read())
        }

        fn get_vote_count(self: @ContractState,) -> u32 {
            self.vote_count.read()
        }

        fn get_vote_results(self: @ContractState, vote_id: u32) -> Map<u32, (felt252, u32)> {
            let vote = self.votes.entry(vote_id);
            let mut results = Map::new();
            let candidate_count = vote.candidates_count.read();

            for (candidate_id, (names, votes)) in vote.candidates.iter() {
                results.insert(candidate_id, (*names, *votes));
            }
            results
        }
        fn is_voting_active(self: @ContractState, vote_id: u32) -> bool {
            let vote = self.votes.entry(vote_id);
            let current_time = get_block_timestamp();
            let voting_end_time = vote.voting_end_time.read();
            current_time <= voting_end_time
        }
    }


    #[generate_trait]
    impl PrivateFunctions of PrivateFunctionsTrait {
        fn add_candidates(ref self: ContractState, vote_id: u32, candidates: Map<u32, felt252>) -> u32 {
            let mut vote = self.votes.entry(vote_id);
            let mut candidate_count = 0;
            for (candidate_id, candidate_name) in candidates{
                vote.candidates.entry(candidate_id).write((candidate_name, 0));
                candidate_count += 1;
            }
            candidate_count
        }
    }
}
