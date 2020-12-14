import mmap

class Map():
    def find_word(self, file_name, word):
        with open(file_name, mode="r", encoding="utf-8") as file_obj:
            with mmap.mmap(file_obj.fileno(), length=0, access=mmap.ACCESS_READ) as mmap_obj:
                return mmap_obj.find(bytes(word, encoding='utf-8'))
