from platforms.platform import Platform


class Civitai(Platform):
    def __init__(self, api_key):
        super().__init__(self, api_key=api_key)

    def get_model_info(self, url):
        return super().get_model_info(url)
