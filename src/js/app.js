App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  
  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {

    if (typeof web3 !== 'undefined') {

      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('https://rpc.elaeth.io/');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("List.json", function(list) {
      App.contracts.List = TruffleContract(list);
      App.contracts.List.setProvider(App.web3Provider);
      App.listenForEvents();
      return App.render();
    });
  },

  listenForEvents: function() {
    var x=0
    App.contracts.List.deployed().then(function(instance) {
      instance.reportEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        App.render();
      });
      instance.dereportEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        App.render(); 
      });
      instance.newPatient({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        App.render(); 
      });
    });
  },

  render: function() {
    var listInstance;
    var loader = $("#loader");
    var content = $("#content");
    
    loader.show();
    content.hide();

    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
    
    App.contracts.List.deployed().then(function(instance) {
      $("#numbers").empty();
      listInstance = instance;
      return listInstance.positiveCount();
    }).then(function(positiveCount) {      
      var counts = "<tr><th>" + "Positive Count" + "</th><td>" + positiveCount + "</td></tr>"
      $("#numbers").append(counts);
           function removeDuplicateRows($table){
           function getVisibleRowText($row){
           return $row.find('td:visible').text().toLowerCase();
            }
            $table.find('tr').each(function(index, row){
            var $row = $(row);
            $row.nextAll('tr').each(function(index, next){
            var $next = $(next);
            if(getVisibleRowText($next) == getVisibleRowText($row))
                $next.remove();
          })
          });
          }

        removeDuplicateRows($('#numbers'));console.log('remove');
      });
      
      App.contracts.List.deployed().then(function(instance) {
      $("#numbers2").empty();
      listInstance = instance;
      return listInstance.activeCount();
    }).then(function(activeCount) {      
      var counts = "<tr><th>" + "Active Count" + "</th><td>" + activeCount + "</td></tr>"
      $("#numbers2").append(counts);
           function removeDuplicateRows($table){
           function getVisibleRowText($row){
           return $row.find('td:visible').text().toLowerCase();
            }
            $table.find('tr').each(function(index, row){
            var $row = $(row);
            $row.nextAll('tr').each(function(index, next){
            var $next = $(next);
            if(getVisibleRowText($next) == getVisibleRowText($row))
                $next.remove();
          })
          });
          }

        removeDuplicateRows($('#numbers2'));console.log('remove');
      });

    // Load contract data
    App.contracts.List.deployed().then(function(instance) {
      listInstance = instance;
      
      return listInstance.patientCount();
    }).then(function(patientCount) {
      
      
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();
      
      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();
      
      for (var i = 1; i <= patientCount; i++) {
        console.log(i)
        listInstance.patient(i).then(function(patient) {
          var X = patient[0];
          var id = patient[1];
          var name = patient[2];
          var status = patient[3];

          var candidateOption = "<option value='" + X + "' >" + id + "</ option>"
          candidatesSelect.append(candidateOption);
         
        function removeDuplicateOptions(s, comparitor) {
    	if(s.tagName.toUpperCase() !== 'SELECT') { return false; }
    	var c, i, o=s.options, sorter={};
    	if(!comparitor || typeof comparitor !== 'function') {
    		comparitor = function(o) { return o.value; };//by default we comare option values.
    	}
    	for(i=0; i<o.length; i++) {
    		c = comparitor(o[i]);
    		if(sorter[c]) {
    			s.removeChild(o[i]);
    			i--;
    		}
    		else { sorter[c] = true; }
    	}
    	return true;
        }
        removeDuplicateOptions(document.getElementById("candidatesSelect"));           
        });
      }

      return listInstance.reporter(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(false) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  reportp: function() {
    var candidateId = $('#candidatesSelect').val();

    App.contracts.List.deployed().then(function(instance) {
      return instance.report(candidateId, { from: App.account });}
    
    ).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },
   reportn: function() {
    var candidateId = $('#candidatesSelect').val();

    App.contracts.List.deployed().then(function(instance) {
      return instance.dereport(candidateId, { from: App.account });}
    
    ).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },
   renderX: function() {
    var candidateId = $('#candidatesSelect').val();
     App.contracts.List.deployed().then(function(instance) {
      listInstance = instance;
      
      return listInstance.patientCount();
    }).then(function(patientCount) {
    for (var i = 1; i <= patientCount; i++) {
        console.log(i)
        listInstance.patient(i).then(function(patient) {
          var X = patient[0];
          var id = patient[1];
          var name = patient[2];
          var status = patient[3];
          if(X==candidateId){
          alert('ID : ' + id +'\nName : ' + name + '\nStatus : ' + status)
          }});
          }
          });
    
  },
   newp: function() {
   var name = $('#pname').val();
   var id = $('#hcode').val().concat($('#pcode').val());
    App.contracts.List.deployed().then(function(instance) {
      listInstance = instance;      
      return listInstance.patientCount();
    }).then(function(patientCount) {
    id = id+patientCount;
    return id;
    }).then(function(id) {
    App.contracts.List.deployed().then(function(instance) {
      return instance.addPatient(name, id, { from: App.account });})}
    
    ).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
   }
 
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
