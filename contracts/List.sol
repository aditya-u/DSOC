pragma solidity ^0.5.0;

contract List {
    // Model a Candidate
    struct Patient {
        uint X;
        string id;
        string name;
        uint status;
    }

    // Store accounts that have voted
    mapping(address => bool) public reporter;
    // Store Candidates
    mapping(address => bool) public dereporter;
    // Fetch Candidate
    mapping(uint => Patient) public patient;
    // Store Candidates Count
    uint public patientCount;
    uint public positiveCount = 0;
    uint public activeCount = 0;

    // voted event
    event reportEvent (
        uint indexed _patientId
    );
    
    event dereportEvent (
        uint indexed _patientId
    );
    
    event newPatient (
        uint indexed _patientId
    );

    constructor() public {
    }

    function addPatient (string memory _name, string memory _ID) public {
        patientCount ++;
        patient[patientCount] = Patient(patientCount, _ID, _name, 0);
        emit newPatient(patientCount);
    }

    function report (uint _patientId) public {
        
        // record that voter has voted
        reporter[msg.sender] = true;

        // update candidate vote Count
        patient[_patientId].status ++;
        positiveCount ++;
        activeCount ++;
        // trigger voted event
        emit reportEvent(_patientId);
    }
    
    function dereport (uint _patientId) public {
        uint a = 1;
        dereporter[msg.sender] = true;
        if (patient[_patientId].status != 0)
        {a=0;}
        patient[_patientId].status --;
        if(a==0)
        {activeCount --;}
        emit dereportEvent(_patientId);
    }
    
}
