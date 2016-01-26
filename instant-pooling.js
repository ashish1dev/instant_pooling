Ideas= new Meteor.Collection("ideas");
Meteor.methods({
	upvote:function(ideaId){
		if(! this.userId)
			return new Meteor.Error(403);
		
		var idea=Ideas.findOne(ideaId);
		Ideas.update(
			ideaId,
			{$set:{votes: idea.votes+1}}
		);
	},
	downvote:function(ideaId){
		if(! this.userId)
			return new Meteor.Error(403);
			
		var idea=Ideas.findOne(ideaId);
		Ideas.update(
			ideaId,
			{$set:{votes: idea.votes-1}}
		);
	}
});


if (Meteor.isServer){
	
	Ideas.allow({
		insert:function(userId,talk){
			return userId && talk.votes==0;
		}
	});

	Meteor.publish("ideas", function(){
		return Ideas.find();
	});
}else if(Meteor.isClient){
	Meteor.subscribe("ideas");
	
	Template.ideasList.ideas = function(){
		return Ideas.find({},{sort:{votes:-1}});
	}
	
	Template.ideasList.events({
		"click .upvote": function(){
			Meteor.call("upvote", this._id);
		},
		"click .downvote": function(){
			Meteor.call("downvote", this._id);
		}
	});
	
	Template.newIdea.events({
		"submit .newIdeaForm":function(evt){
			evt.preventDefault();
			Ideas.insert({
				title:$(".title").val(),
				idea_by:$(".idea_by").val(),
				votes:0
			},function(err){
				if(!err){
					$("input[type=text]").val();
				}
			});
		}
	});
}