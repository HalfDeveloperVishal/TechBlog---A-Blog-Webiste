from rest_framework import serializers
from .models import Post, Comment

class PostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    comments_count = serializers.IntegerField(read_only=True)  # new field added
    likes_count = serializers.IntegerField(read_only=True)  # <-- add this line
    liked_by_user = serializers.SerializerMethodField()


    class Meta:
        model = Post
        fields = ['id', 'title', 'category', 'description', 'created_at', 'username', 'comments_count','likes_count','liked_by_user']
        read_only_fields = ['id', 'created_at', 'comments_count','likes_count','liked_by_user']
        
    def get_likes_count(self, obj):
        return obj.likes.count()
        
    def get_liked_by_user(self, obj):
        request = self.context.get('request')
        user = request.user if request else None
        if user and user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'username', 'content', 'created_at']
        read_only_fields = ['id', 'created_at', 'user', 'username']
