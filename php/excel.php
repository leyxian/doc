<?php
/**
 * [$excel 导入解析]
 * @var [type]
 */
$excel=PHPExcel_IOFactory::load("file.xlsx");//把导入的文件目录传入，系统会自动找到对应的解析类
$sheet=$excel->getSheet(0);//选择第几个表，如下面图片，默认有三个表
$data=$sheet->toArray();//把表格的数据转换为数组，注意：这里转换是以行号为数组的外层下标，列号会转成数字为数组内层下标，坐标对应的值只会取字符串保留在这里，图片或链接不会出现在这里。
/*取图片*/
$imgData=array();
$imageFilePath='/images/'.date('Y/m/d').'/';//图片保存目录
foreach($sheet->getDrawingCollection() as $img){
    list ($startColumn, $startRow) = PHPExcel_Cell::coordinateFromString($img->getCoordinates());//获取列与行号
    $imageFileName=$img->getCoordinates().mt_rand(100,999);
    /*表格解析后图片会以资源形式保存在对象中，可以通过getImageResource函数直接获取图片资源然后写入本地文件中*/
    switch ($img->getMimeType()){//处理图片格式
        case 'image/jpg':
        case 'image/jpeg':
            $imageFileName.='.jpg';
            imagejpeg($img->getImageResource(),$imageFilePath.$imageFileName);
            break;
        case 'image/gif':
            $imageFileName.='.gif';
            imagegif($img->getImageResource(),$imageFilePath.$imageFileName);
            break;
        case 'image/png':
            $imageFileName.='.png';
            imagepng($img->getImageResource(),$imageFilePath.$imageFileName);
            break;
    }
    $imgData[$startRow][$startColumn]=$imageFileName;//追加到数组中去
}


$excel=new PHPExcel();//创建PHPExcel对象
/*写入文档所有权属性*/
$excel->getProperties()
    ->setCreator("Maarten Balliauw")//设置创建人
    ->setLastModifiedBy("Maarten Balliauw")//设置修改人
    ->setTitle("Office 2007 XLSX Test Document")//设置标题
    ->setSubject("Office 2007 XLSX Test Document")//设置题目
    ->setDescription("Test document for Office 2007 XLSX, generated using PHP classes.")//设置描述
    ->setKeywords("office 2007 openxml php")//设置关键字
    ->setCategory("Test result file");//设置种类
     
     
/*设置默认字体与大小*/
$excel->getDefaultStyle()
    ->getFont()//获取字体对象
    ->setName('Arial')//设置字体
    ->setSize(10);//设置字体大小
     
     
/*设置当前的sheet*/
$excel->setActiveSheetIndex(0);
 
/*设置sheet的name*/
$excel->getActiveSheet()->setTitle('表格1');
 
/*写入常规文本*/
$excel->getActiveSheet()
    ->setCellValue('A1', 'String')
    ->setCellValue('B1', 'Simple')
    ->setCellValue('C1', 'PHPExcel');
     
     
/*写入自定义样式文本*/
$objRichText = new PHPExcel_RichText();
$objRichText->createText('你好 ');
$objPayable = $objRichText->createTextRun('你 好 吗？');
$objPayable->getFont()
    ->setBold(true);
$objPayable->getFont()
    ->setItalic(true);
$objPayable->getFont()
    ->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKGREEN ) );
$objRichText->createText(', unless specified otherwise on the invoice.');
$excel->getActiveSheet()
    ->setCellValue('A13', 'Rich Text')
    ->setCellValue('C13', $objRichText);
     
     
/*写入有链接的文本*/
$excel->getCell('A2')
    ->setValue('web中的php')
    ->getHyperlink()
    ->setUrl('http://php2012web.blog.51cto.com/');
 
/*写入图片*/
//使用另一个表格图片对象添加图片
/*
    $img=new PHPExcel_Worksheet_MemoryDrawing();
    $img->setImageResource($images->getImageResource());
    $img->setMimeType($images->getMimeType());
    $img->setName($images->getName());
    $img->setDescription($images->getDescription());
*/
//使用本地图片
$img=new PHPExcel_Worksheet_Drawing();
$img->setPath('/img/text.jpg');//写入图片路径
$img->setHeight(100);//写入图片高度
$img->setWidth(100);//写入图片宽度
$img->setOffsetX(1);//写入图片在指定格中的X坐标值
$img->setOffsetY(1);//写入图片在指定格中的Y坐标值
$img->setRotation(1);//设置旋转角度
$img->getShadow()->setVisible(true);//
$img->getShadow()->setDirection(50);//
$img->setCoordinates('B2');//设置图片所在表格位置
$img->setWorksheet($excel->getActiveSheet());//把图片写到当前的表格中
 
 
/*生成文件*/
 
$objWriter = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');//创建写文件生成器
$objWriter->save('excel.xlsx');//生成文件
?>