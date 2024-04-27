from platforms.platform import Platform

class Civitai(Platform):
    def __init__(self):
        pass

    def get_model_info(self, url):
        return super().get_model_info(url)