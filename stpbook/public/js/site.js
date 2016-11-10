function uploadPic(form){
   var owner = $("#folderOwner").val();
   form.action="/"+owner+"/new";
   form.submit();
}

function makeComment(){
    //alert("make comment!");
    // var msg = $("#pic").val()+","+$("#user").val()+","+$("#comment").val();
    // alert(msg);
    $.post("/comment",
          {pic:$("#pic").val(),user:$("#user").val(),comment:$("#comment").val()},
          function(data){
             if(data.result==0){
               $("#successbox").html($("#user").val()+"对于"+$("#pic").val()+"图片的评论发布成功，感谢!");
               $("#successbox").fadeIn(1000);
               $("#successbox").fadeOut(3000);

               commentInfo ='<div class="list-group"><a class="list-group-item"><h4 class="list-group-item-heading">'
                                     +$("#user").val()+'</h4><p class="list-group-item-text">'
                                     +$("#comment").val()+'</p></a></div>';

               $("#comments-group").prepend(commentInfo);

             }
             else{
               $("#failbox").fadeIn(1000);
             }
          }
        );
}

function removeComment(){

    if(confirm("您确认要清空屏幕上的评论信息吗？")){
       $("#comments-group").empty();
    }

}

function loadComment(pic){

    $.get("/"+pic+"/comment",
          {},
          function(data){
             //alert(data);
             //alert($("#commentTPL").html());
             var compiled = _.template($("#commentTPL").html());
             var output ="";
             for(var i=0;i<data.length;i++){
               output += compiled(data[i]);
             }
             //alert(output);
             $("#comments-group").html(output);

          }
        );

}
