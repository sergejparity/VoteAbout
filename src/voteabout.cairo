#[starknet::interface]
trait IVoting<TContractState> {
    fn add_candidate(ref self: TContractState, candidate_name: felt252) -> bool;
    fn register_voter(ref self: TContractState, voter_address: ContractAddress) -> bool;
    fn vote(ref self: TContractState, voter_address: ContractAddress, candidate_index: u8) -> bool;
    fn get_candidate(self: @TContractState, candidate_index: u8) -> Voting::Candidate;
    fn get_candidate_vote(self: @TContractState, candidate_index: u8) -> u32;
    fn winner(self: @TContractState) -> Voting::Candidate;
    fn get_owner(self: @TContractState) -> ContractAddress;
    fn transfer_ownership(ref self: TContractState, new_owner: ContractAddress);
}

#[starknet::contract]
pub mod voteabout{

    use OwnableComponent::InternalTrait;
    use openzeppelin::access::ownable::OwnableComponent;
    use core::starknet::event::EventEmitter;
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::storage::Map;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl InternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        candidateId: u8,
        Candidates: Map<u8, Candidate>,
        voters: Map<ContractAddress, Voter>,

        #[substorage(v0)]
        ownable: OwnableComponent::Storage
    }

    #[derive(Drop, Serde, starknet::Store)]
    pub struct  Candidate{
        id: u8,
        name: felt252,
        voteCount: u32
    }

    #[derive(Drop, Serde, starknet::Store)]
    pub struct Voter{
        hasVote: bool,
        isRegistered: bool
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {

        #[flat]
        OwnableEvent: OwnableComponent::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState, initial_owner:ContractAddress) {
        self.ownable.initializer(initial_owner)
    }

}