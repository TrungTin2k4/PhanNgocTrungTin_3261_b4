module.exports = {
    ConvertTitleToSlug: function (title) {
        if (!title) return '';
        
        // Chuyển về chữ thường
        let result = title.toLowerCase();
        
        // Xử lý các ký tự tiếng Việt có dấu
        const vietnameseMap = {
            'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
            'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
            'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
            'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
            'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
            'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
            'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
            'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
            'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
            'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
            'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
            'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
            'đ': 'd'
        };
        
        // Replace Vietnamese characters
        for (const [key, value] of Object.entries(vietnameseMap)) {
            result = result.split(key).join(value);
        }
        
        // Thay thế các ký tự đặc biệt và khoảng trắng thành dấu gạch ngang
        // Giữ lại chữ cái, số, và thay thế các ký tự còn lại thành dấu gạch ngang
        result = result.replace(/[^a-z0-9]+/g, '-');
        
        // Loại bỏ dấu gạch ngang ở đầu và cuối
        result = result.replace(/^-+|-+$/g, '');
        
        // Loại bỏ các dấu gạch ngang liên tiếp
        result = result.replace(/-+/g, '-');
        
        return result;
    }
}