Template.oembedBaseWidget.helpers
	template: ->
		if this._overrideTemplate
			return this._overrideTemplate

		if this.headers?.contentType?.match(/image\/.*/)?
			return 'oembedImageWidget'

		if this.headers?.contentType?.match(/audio\/.*/)?
			return 'oembedAudioWidget'

		if this.headers?.contentType?.match(/video\/.*/)?
			return 'oembedVideoWidget'

		if this.parsedUrl?.host is 'www.youtube.com' and this.meta?.twitterPlayer?
			return 'oembedYoutubeWidget'

		return 'oembedUrlWidget'
