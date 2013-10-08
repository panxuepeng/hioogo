# validator.js

һ���򵥡���������������ǿ��� Validator ��������ҿ��Է�����չ�����жϣ�

- jQuery ��������弴��
- ���� HTML5 �� API ���
- ������������������� IE 6+

## ʹ�÷���

### һ��ʵ����
```js
$('#form_id').validator(options);
```

`validator` ����֧��һ�� `options` ������Ϊ����������������ʱ��`options` �߱�Ĭ��ֵ�������Ķ�������������

```js
options = {
  // ��ҪУ��ı����Ĭ���� `[required]`����֧���κ� jQuery ѡ��������ѡ��ı�ʶ
  identifie: {String},                                                 

  // У�鲻ͨ��ʱ����ʱ��ӵ� class ����Ĭ���� `error`������У��Ϊ��ʱ����ͬʱӵ�� `empty` ��� classname
  klass: {String},

  // �������ʱ `klass` ���ڵ�ǰ����Ǹ��ڵ㣨Ĭ���ǵ�ǰ���
  isErrorOnParent: {Boolean},

  // ��������У��ķ��������� false �ڵ� submit ��ť֮ǰ��У�飨Ĭ���� `blur`��
  method: {String | false},

  // ����ʱ�� callback����һ�����������г�������
  errorCallback(unvalidFields): {Function},

  before: {Function}, // ������֮ǰ
  after: {Function}, // ��У��֮��ֻ�� __return true__ �Ż��ύ��
 }                                                                                                     
```

### ����HTML ���

Ŀǰ type ������֧�� email/tel/url/range/number �� HTML5 Form API ֧�ֵ����ͣ��� type �����ڣ���Ϊ��֤��ʱ������Ա��Ƿ��пգ����б�� `maxLength` ��ʱ����֤��ֵ�ĳ��ȣ����� min/max ��ʱ��� `type=range` һ����֤��ǰֵ�Ƿ��� min/max ���䣺`min <= value <= max`��

ͬʱ����������� pattern ���ԣ���ʹ�� type ��Ϊ��֤�������� HTML5 API һ�£�������Ϊһ�ֱ��Զ�����֤�ķ�ʽ���������������������� type="email" ����֤������ʹ�� pattern �е�������ʽ����֤��

```html
<input type="email" pattern="���� HTML5 �淶��������ʽ" />
```

ע��type ��֧���� validator.js �е� patterns ��������С�

#### 1. һ����

�� html ����ϣ�һ����Ҫ��֤�ı����Ҫ���� `required` ���ԣ����� `options.identifie` ��ָ����ѡ���������磺

```html
<input type="email" required /> 
<select required>
  <option>...
</select>
<div contenteditable pattern="^\d+$"></div>
```

#### 2. Checkbox & Radio

`input:checkbox` Ĭ�ϲ�У�飬`input:radio` ���� name �������������Ҳ�������� `name='abc'` �� radio ��һ���� checked����ô��ʾ��һ�� radio ͨ����֤��

```html
<label><input type="radio" required name="abc" value="A">[A]</label>
<label><input type="radio" required name="abc" value="B">[B]</label>
<label><input type="radio" required name="abc" value="C">[C]</label>
```

#### 3. �첽֧��

����Ҫ�첽��֤ʱ���ڱ����һ�� data-url ������ָ���첽��֤�� URL �ǿɣ��м�����ѡ���

```
data-url: �첽��֤�� url
data-method: [��ѡ] AJAX ����ķ���: get,post,getJSON �ȣ�Ĭ���� get
data-key: [��ѡ] ���͵�ǰ��ֵʱ�õ� key��Ĭ���� 'key'��$.get(url, {key: ����ֵ})
```

html ������£�

```html
<input type="text" data-url="https://api.github.com/legacy/user/search/china" data-method="getJSON" required>
```

#### 4. ��ѡһ

֧�ֶ�ѡһ��������ϵ��ʽ���������ֻ�����ֻ��һ�HTML �ı�����£�����Ҫ�˹��ܵ������ `data-aorb` ���ԣ�ָ�� a ���� b��˳������෴��

```js
<input data-aorb="a" >
<input data-aorb="b" >
```

NOTE: ˳��˵һ�䣬ʵ�ֶ�ѡһ������Ը���һ�㣬�������������Ǹ�����������Զ���һ�¡�

#### 5. ֧���Զ���Ԫ�ص��¼�

������ html ����� `data-event` ���ڵ�����Ԫ���д����Զ����¼���������������һ�� `hello` �¼������ջᴥ������֤�����ǰ���� `before.hello` �¼�����������֤�굱ǰ���󴥷�һ�� `after.hello` �¼���Ĭ�ϲ������κ��¼���

```html
<input id="event" type="text" data-event="hello" required>
```

����ʹ�ñ�׼�� jQuery `on` ����������¼���

```js
$('#event').on('before:hello', function(event, element){
  alert('`before.hello` event trigger on $("#' + element.id + '")');
})

$('#event').on('after:hello', function(event, element){
  alert('`after.hello` event trigger on $("#' + element.id + '")');
})
```
#### 6. ֧����ָ��Ԫ����Ӵ��� class
������ html ����� `data-parent` ����ָ����Ҫ��Ӵ��� class ��Ԫ�أ�����ֵΪ���� jQuery ѡ����֧�ֵ��﷨������һ������Ƕ�׶�㣬����ͨ���ڸñ������ `data-parent='div[name="test"].parent'` ���ƶ��ھ�ñ�����ĸ���Ԫ���� `name="test"` ���� `class="parent"` �� `div` Ԫ������Ӵ��� class������

```html
<div name="test" class="parent">
	<p>
		<input type="test" data-parent="div[name="test"].parent" required>
	</p>
</div>
```

## ͨ��Լ���ʹ���淶��

- �� 2-spaces ��Ϊ����
- �����ȶ����ֵ�����Ǹ�ֵ����д�ɵ��У�
- �����г����� $ ��ͷ�Ķ��󣬸�Ϊ jQuery ���󣬱��� $item

## ����������

ʹ�� examples/index.php ����ļ�

## ���Э��

���� MIT Э����Ȩ�������ʹ�����κεط���������ҵӦ�ã����޸Ĳ����·����������[LICENSE](https://github.com/sofish/validator.js/blob/master/LICENSE)

## ������

- __[Chris Yip](https://github.com/ChrisYip)__: [http://chrisyip.im/](http://chrisyip.im/)
- __[�໨ľľ](https://github.com/zhanglin800)__: [http://zhanglin.org](http://zhanglin.org)
