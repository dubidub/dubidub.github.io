function sort_hotel_list(hotel_list) {
  let sort_by = getCookie('sort_by'),
      hotel_list_to_be_sorted = [],
      hotel_list_sorted = [];
  // console.log(sort_by);
  for ( let item of hotel_list ) {
    let name = matched_hotels[item]['name'],
        elites = matched_hotels[item]['elites'],
        e_prog = Object.keys(elites),
        e_perks = [];
    for ( let i=0; i<e_prog.length; i++ ) {
      let elite = e_prog[i],
          hotel_in_elite = elites[elite]['id'],
          perks_of_hotel = all_elite_perks[elite][hotel_in_elite]['perks'],
          list_of_perks = Object.keys(perks_of_hotel);
      for ( let j=0; j<list_of_perks.length; j++ ) {
        if ( perks_of_hotel[list_of_perks[j]].length > 0 && !e_perks.includes(list_of_perks[j]) ) {
          e_perks.push(list_of_perks[j]);
        }
      }
    }
    let single_hotel_for_sorting = {
      'id': item,
      'name': name,
      'elitesNo': e_prog.length,
      'perksNo': e_perks.length
    };
    hotel_list_to_be_sorted.push(single_hotel_for_sorting);
  }
  if ( sort_by == 'elite' ) {
    sortDictList(hotel_list_to_be_sorted, 'elitesNo', 'desc', 'perksNo', 'desc', 'name', 'asc');
    for ( let item of hotel_list_to_be_sorted ) {
      hotel_list_sorted.push(item['id']);
    }
  } else if ( sort_by == 'perk' ) {
    sortDictList(hotel_list_to_be_sorted, 'perksNo', 'desc', 'elitesNo', 'desc', 'name', 'asc');
    for ( let item of hotel_list_to_be_sorted ) {
      hotel_list_sorted.push(item['id']);
    }
  } else if ( sort_by == 'name_asc' ) {
    sortDictList(hotel_list_to_be_sorted, 'name', 'asc', 'elitesNo', 'desc', 'perksNo', 'desc');
    for ( let item of hotel_list_to_be_sorted ) {
      hotel_list_sorted.push(item['id']);
    }
  } else {
    sortDictList(hotel_list_to_be_sorted, 'name', 'desc', 'elitesNo', 'desc', 'perksNo', 'desc');
    for ( let item of hotel_list_to_be_sorted ) {
      hotel_list_sorted.push(item['id']);
    }
  }
  // console.log(hotel_list_sorted);
  return hotel_list_sorted;
}

function sortDictList(list, key, order, key2, order2, key3, order3) {   // this is the soring function answered by ChatGPT
  list.sort(function(a, b) {
    var x = a[key];
    var y = b[key];
    if (x == y) {
      x = a[key2];
      y = b[key2];
      if (x == y) {
        x = a[key3];
        y = b[key3];
      }
    }
    if (order == "desc") {
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    } else {
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
  });
  return list;
}

function render_hotelPanel_handle(hotel_list) {
  let sort_by = getCookie('sort_by'),
      hotelPanel_handle = '<div class="hotelPanel_handle"><div class="hotelPanel_handle_results">',
      sort_options = '';
  if ( hotel_list.length > 1 ) {
    hotelPanel_handle = hotelPanel_handle + hotel_list.length + ' results</div>';
  } else if ( hotel_list.length == 1 ) {
    hotelPanel_handle = hotelPanel_handle + hotel_list.length + ' result</div>';
  } else if ( hotel_list.length == 0 ) {
    hotelPanel_handle = hotelPanel_handle + 'No matched results</div>';
  }
  if ( sort_by == 'elite' ) {
    sort_options =  '<div class="hotelPanel_handle_sort">' +
                    '<select id="sort_options" onchange="sort_hotels()">' +
                    '<option value="elite" selected>Sort by: Most preferred partners first</option>' +
                    '<option value="perk">Sort by: Most perk types first</option>' +
                    '<option value="name_asc">Sort by: Hotel name (A to Z)</option>' +
                    '<option value="name_desc">Sort by: Hotel name (Z to A)</option>' +
                    '</select>' +
                    '</div></div>';
  } else if ( sort_by == 'perk' ) {
    sort_options =  '<div class="hotelPanel_handle_sort">' +
                    '<select id="sort_options" onchange="sort_hotels()">' +
                    '<option value="elite">Sort by: Most preferred partners first</option>' +
                    '<option value="perk" selected>Sort by: Most perk types first</option>' +
                    '<option value="name_asc">Sort by: Hotel name (A to Z)</option>' +
                    '<option value="name_desc">Sort by: Hotel name (Z to A)</option>' +
                    '</select>' +
                    '</div></div>';
  } else if ( sort_by == 'name_asc' ) {
    sort_options =  '<div class="hotelPanel_handle_sort">' +
                    '<select id="sort_options" onchange="sort_hotels()">' +
                    '<option value="elite">Sort by: Most preferred partners first</option>' +
                    '<option value="perk">Sort by: Most perk types first</option>' +
                    '<option value="name_asc" selected>Sort by: Hotel name (A to Z)</option>' +
                    '<option value="name_desc">Sort by: Hotel name (Z to A)</option>' +
                    '</select>' +
                    '</div></div>';
  } else {
    sort_options =  '<div class="hotelPanel_handle_sort">' +
                    '<select id="sort_options" onchange="sort_hotels()">' +
                    '<option value="elite">Sort by: Most preferred partners first</option>' +
                    '<option value="perk">Sort by: Most perk types first</option>' +
                    '<option value="name_asc">Sort by: Hotel name (A to Z)</option>' +
                    '<option value="name_desc" selected>Sort by: Hotel name (Z to A)</option>' +
                    '</select>' +
                    '</div></div>';
  }

  // hotelPanel_handle = hotelPanel_handle + '<div class="hotelPanel_handle_sort"></div></div>';
  document.getElementById("hotelPanel").innerHTML = hotelPanel_handle + sort_options;
}

function sort_hotels() {
  let selectedValue = document.getElementById("sort_options").value,
      hotel_list = getCookie('searchresults_properties').split(',');;
  setCookie('sort_by', selectedValue);
  show_search_results(hotel_list);
}
