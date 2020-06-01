# mern-stack-blog-website

## API (Client - Server)

| Method | Endpoint | Protected | Usage | Response |
| --- | --- | --- | --- | --- |
| Get | /api/blogs/:name | No | Get blog by name | res.status(200).json(updatedBlogInfo); |
| Post | /api/blogs/:name/likes | No | Add like | res.status(200).json(updatedBlogInfo); |
| Post | /api/blogs/:name/dislikes | No | Add dislike | res.status(200).json(updatedBlogInfo); |

