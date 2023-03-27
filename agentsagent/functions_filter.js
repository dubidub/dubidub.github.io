var filter_perk = {};

var filter_e_prog = {}

function select_all_hotels() {
  var checkboxes = document.getElementsByName('elite_fliter');
  if (document.getElementById("hotel_program_checkbox").checked == false) {
    for (var checkbox of checkboxes) {
      checkbox.checked = false;
    }
  } else {
    for (var checkbox of checkboxes) {
      checkbox.checked = true;
    }
  }
  get_ep_filter();
}
function select_all_perks() {
  var checkboxes = document.getElementsByName('perk_filter');
  if (document.getElementById("perks_checkbox").checked == false) {
    for (var checkbox of checkboxes) {
      checkbox.checked = false;
    }
  } else {
    for (var checkbox of checkboxes) {
      checkbox.checked = true;
    }
  }
  get_ep_filter();
}

function get_ep_filter() {
  let checkboxes = document.querySelectorAll('input[type=checkbox]:checked'),
      filtered_list_e_prog = [],
      filtered_list_perk = [],
      filtered_list = [];

  // get union from each array in 2 filter separately
  for ( let i = 0; i < checkboxes.length; i++ ) {
    if ( checkboxes[i].name == "elite_fliter" ) {
      filtered_list_e_prog = Array.from(new Set([...filtered_list_e_prog, ...filter_e_prog[checkboxes[i].value]]));
    } else if ( checkboxes[i].name == "perk_filter" ) {
      filtered_list_perk = Array.from(new Set([...filtered_list_perk, ...filter_perk[checkboxes[i].value]]));
    }
  }
  // get intersection from both filters
  for ( let i = 0; i < filtered_list_e_prog.length; i++ ) {
    if ( filtered_list_perk.includes(filtered_list_e_prog[i]) ) {
      filtered_list.push(filtered_list_e_prog[i]);
    }
  }
  // let sort_by = document.getElementById("sort_options").value;
  show_search_results(filtered_list);
  close_option_modal();
}

function clear_filters() {
  let e_prog = Object.keys(filter_e_prog),
      list_of_perks = Object.keys(filter_perk);
  for ( let i=0; i<e_prog.length; i++ ) {
    filter_e_prog[e_prog[i]] = [];
    document.getElementById(e_prog[i]).checked = false;
    document.getElementById(e_prog[i]).disabled = true;
  }
  for ( let i=0; i<list_of_perks.length; i++ ) {
    filter_perk[list_of_perks[i]] = [];
    document.getElementById(list_of_perks[i]).checked = false;
    document.getElementById(list_of_perks[i]).disabled = true;
  }
}

function add_filters(hotel_list) {
  for ( let i=0; i<hotel_list.length; i++ ) {
    let hotel_id = hotel_list[i],
        hotel_info = matched_hotels[hotel_id],
        elites = hotel_info['elites'],
        e_prog = Object.keys(elites);

    for ( let j=0; j<e_prog.length; j++ ) {
      // add hotel ID to hotel collection filter : filter_e_prog
      if ( !filter_e_prog[e_prog[j]].includes(hotel_id) ) {
        filter_e_prog[e_prog[j]].push(hotel_id);
      }

      // add hotel ID to perk filter : filter_perk
      let hotel_in_elite = elites[e_prog[j]]['id'],
          perks_of_hotel = all_elite_perks[e_prog[j]][hotel_in_elite]['perks'],
          list_of_perks = Object.keys(perks_of_hotel);
      for ( let k=0; k<list_of_perks.length; k++ ) {
        if ( perks_of_hotel[list_of_perks[k]].length > 0 && !filter_perk[list_of_perks[k]].includes(hotel_id) ) {
          filter_perk[list_of_perks[k]].push(hotel_id);
        }
      }
    }
  }
  check_filter_boxes();
}

function check_filter_boxes() {
  // document.querySelector(".filter_box_wrapper").style.color = "#aaa";
  let e_prog = Object.keys(filter_e_prog),
      list_of_perks = Object.keys(filter_perk);
  for ( let i=0; i<e_prog.length; i++ ) {
    document.getElementById(e_prog[i]).nextElementSibling.style.color = "#aaa";
    if ( filter_e_prog[e_prog[i]].length > 0 ) {
      document.getElementById(e_prog[i]).checked = true;
      document.getElementById(e_prog[i]).disabled = false;
      document.getElementById(e_prog[i]).nextElementSibling.style.color = "black";
    }
  }
  for ( let i=0; i<list_of_perks.length; i++ ) {
    document.getElementById(list_of_perks[i]).nextElementSibling.style.color = "#aaa";
    if ( filter_perk[list_of_perks[i]].length > 0 ) {
      document.getElementById(list_of_perks[i]).checked = true;
      document.getElementById(list_of_perks[i]).disabled = false;
      document.getElementById(list_of_perks[i]).nextElementSibling.style.color = "black";
    }
  }
}

function render_filter_boxes() {
  // render hotel filters
  let elite_desc_keys = Object.keys(elite_desc);
  for ( let i=0; i<elite_desc_keys.length; i++ ) {
    filter_e_prog[elite_desc_keys[i]] = []
  }
  let filter_box_wrappers_hotel = '';
  for ( let i=0; i<elite_desc_keys.length; i++ ) {
    filter_box_wrappers_hotel +=
      '<div class="filter_box_wrapper">' +
      '<input type="checkbox" id="' + elite_desc_keys[i] + '" name="elite_fliter" value="' + elite_desc_keys[i] + '" onclick="get_ep_filter()" disabled>' +
      '<label for="' + elite_desc_keys[i] + '">' + elite_desc[elite_desc_keys[i]] + '</label><br>' +
      '</div>'
  }
  let filter_box_hotel_content =
    '<div class="filter_box_hotel_handle">Hotel preferred partners' +
    '<input type="checkbox" onclick="select_all_hotels()" style="float:right" id="hotel_program_checkbox" checked></div>' +
    filter_box_wrappers_hotel;
  document.getElementById("filter_box_hotel").innerHTML += filter_box_hotel_content;

  // render perks filter
  let perks_desc_keys = Object.keys(perks_desc);
  for ( let i=0; i<perks_desc_keys.length; i++ ) {
    filter_perk[perks_desc_keys[i]] = []
  }
  let filter_box_wrappers_perks = '';
  for ( let i=0; i<perks_desc_keys.length; i++ ) {
    filter_box_wrappers_perks +=
      '<div class="filter_box_wrapper">' +
      '<input type="checkbox" id="' + perks_desc_keys[i] + '" name="perk_filter" value="' + perks_desc_keys[i] + '" onclick="get_ep_filter()" disabled>' +
      '<label for="' + perks_desc_keys[i] + '">' + perks_desc[perks_desc_keys[i]] + '</label><br>' +
      '</div>'
  }
  let filter_box_perks_content =
    '<div class="filter_box_perks_handle">Perk types' +
    '<input type="checkbox" onclick="select_all_perks()" style="float:right" id="perks_checkbox" checked></div>' +
    filter_box_wrappers_perks;
  document.getElementById("filter_box_perks").innerHTML += filter_box_perks_content;
}
