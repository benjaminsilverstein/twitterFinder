// **************** FETCH CODE *****************

const apikey = "QOAau4ozeKKrD9pMeIZ901gdZp2dUi8C85Oqof1T";
const endpoint =
  "https://api.propublica.org/congress/v1/116/senate/members.json";
const endpoint2 =
  "https://api.propublica.org/congress/v1/116/house/members.json";
const congress = [];

function getCongress() {
  const options = {
    headers: new Headers({
      "X-Api-Key": apikey
    })
  };

  fetch(endpoint, options)
    .then(response => response.json())
    .then(responseJson => congress.push(...responseJson.results[0].members));

  fetch(endpoint2, options)
    .then(response => response.json())
    .then(responseJson => congress.push(...responseJson.results[0].members));
  console.log(congress);
}

$(getCongress);

// **************** Autofind *****************

function findMatches(wordToMatch, congress) {
  return congress.filter(member => {
    const regex = new RegExp(wordToMatch, "gi");
    return member.first_name.match(regex) || member.last_name.match(regex);
  });
}

const searchTerm = $("#search").val();

$("#search").change(displayMatches);
$("#search").keyup(displayMatches);

// **************** display *****************
function displayMatches() {
  $("main").css({ background: "#fbde44ff" });
  const matchArray = findMatches(this.value, congress);
  const html = matchArray
    .map(member => {
      return `
      <li class="${member.twitter_account}"><span class="name">${
        member.first_name
      } ${member.last_name}</span>, <span class="district">${member.state}${
        member.district ? "-" + member.district : ""
      }</span>
      <span class="hidden" id="${member.twitter_account}">@${
        member.twitter_account
      }</span>
      </li>`;
    })
    .join("");
  $(".suggestions").html(html);
}

$(".li").on("click", event => {
  console.log();
});

$("form").on("click", "li", event => {
  twitterHandle = event.currentTarget.className;
  $(".results").append(`@${twitterHandle} `);
  $("#search").val("");
});

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).html()).select();
  document.execCommand("copy");
  $temp.remove();
}
