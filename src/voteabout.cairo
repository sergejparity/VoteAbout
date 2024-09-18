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

    // we will be using openzeppelin ownable component as owner
}