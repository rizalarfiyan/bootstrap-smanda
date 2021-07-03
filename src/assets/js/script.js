console.log("Loaded!!");

$('#showhidepassword').on('click', function() {
  let that = this
  let prev = $(that).prev()
  let bool = prev.attr('type') == 'password'
  let confirm = $('input[name="password_confirmation"]')
  let icon = bool ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>'
  prev.attr('type', bool ? 'text' : 'password')
  $(that).find('.icon').html(icon)
  if (confirm) confirm.attr('type', bool ? 'text' : 'password')
})
