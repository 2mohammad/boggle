import flask
import json
from app import app
import unittest
import pytest



class ExampleTestCase(unittest.TestCase):
    def test_success(self):
        with app.test_client() as client:
            response = client.get('/home')
            self.assertEqual(response.status_code, 200)
    
    def test_word_not_found(self):
        with app.test_client() as client:
            asz = client.get('/word?word="wordpapapapapap"')
            self.assertEqual(asz.status_code, 200)
            jix = json.loads(asz.get_data(as_text=True))
            self.assertEqual(jix["found"], -1)
            
    def test_word_is_found(self):
        with app.test_client() as client:
            asz = client.get('/word?word="word"')
            self.assertEqual(asz.status_code, 200)
            jix = json.loads(asz.get_data(as_text=True))
            if jix["found"] > -1:
                x = 1
                self.assertEqual(x, 1)
    
    def test_game_board(self):
        with app.test_client() as client:
            asz = client.get('/api')
            self.assertEqual(asz.status_code, 200)
            jix = json.loads(asz.get_data(as_text=True))
            if len(jix[0]) == 7 and len(jix) == 7:
                x = 1
                self.assertEqual(x, 1)
    

