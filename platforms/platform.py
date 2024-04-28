from abc import abstractmethod


class Platform:
    def __init__(self, api_key):
        self.api_key = api_key

    @abstractmethod
    def fetch_model_info(self, params):
        pass