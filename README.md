# Capital Interest

Personal automation toolset for Capital Z, electronic music producer.


## Watcher Uploader

Capital Z records his productions live using Traktor Kontrol software on his Macs.

He runs the WatcherUploader to automatically upload new tracks from Traktor to
his database on Amazon S3.

```
docker run -v /Users/zyler/Music/Traktor/Recordings:/var/recordings --env-file=.env -d --restart=always stevenzeiler/capitalinterest-watcher-uploader:latest
```

Environment file:

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

