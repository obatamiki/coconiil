# ここにいる

*このネコはあなたがそばにいる間だけ存在できる、不思議なネコです。あなたとともに過ごした時間を覚えていてくれます。*

ネコが在宅時間の累計を記録することで、在宅にちょっとしたなごみと達成感をもたらすデスクトップアプリです。

アプリにスマートフォンのMACアドレスを登録し、アプリを起動しているPC(Mac)と同一LANに接続している間を在宅と判定します。

# 動作環境

* Windows 7以降 32bit,64bit(インストーラがインストール時に自動判別)
* macOS 10.10 (Yosemite) 以降 64bit

# インストール・アンインストール

一般的なインストーラの形式でインストールします。アンインストールも一般的な方法で行います。

# インストーラのダウンロード時や実行時にありうる各種警告について
Windows, macOS のいずれにおいても、インストーラのダウンロード時や実行時に警告ダイアログが表示され、ダウンロードや実行が阻害される場合があります。

これにはいくつかの理由が考えられ、いずれもセキュリティ上の理由によるものです。
* コード署名がないことによる OS からの警告
* アンチウイルスソフトによる警告

このアプリをインストールし実行するには、このアプリが安全であると信じていただいた上で、これらの警告を無視あるいは回避してダウンロードや実行を行っていただく必要があります。

macOSでは、Controlキーを押しながらアイコンクリックすることで開けるコンテキストメニューから「開く」を行えば、コード署名がないアプリを開けます。

Windows版v0.0.1のインストーラを [Virustotal](https://www.virustotal.com/) でチェックすると、1つのエンジンが HW32.Packed. を検出しますが、他の多数のエンジンは検出が無く、誤検知と考えています。

このアプリに悪意のある実装が無いことを第三者が検証可能にするため、 GitHub にてソースを公開しています。

不安がらせたうえにお手間を取らせてしまい申し訳ありません。

# 使い方

スマートフォンをPC(Mac)と同一のLANに接続してください。無線LANルータが一台だけの環境なら、両者をインターネット接続すれば自然とそうなるはずです。

初回起動時にはMACアドレスを設定するダイアログが自動的に開きますので、スマートフォンのMACアドレスを指定してください。

あとは自動的に在宅時間累計がカウントされていきます。

初回起動時以降、対象MACアドレスはメニューから変更できます。

# 補足

iOSやAndroidの設定画面上で"Wi-Fiアドレス"や"Wi-Fi MACアドレス"となっている、"01:23:45:AB:CD:EF"のような文字列が、ここで言うMACアドレスです（Wi-Fiでネットワーク接続しているという前提です）。機種やOSバージョンによっては別の表現かもしれません。英文字の大文字小文字の違いは無視してください。

スマートフォン側の、MACアドレスをランダム化する機能は無効にする（デバイスのMACアドレスを使用する）必要があります。Android 10 以降で、MACアドレスのランダム化は有効がデフォルトになっているようです。

公共のWi-Fiスポット経由では使えませんし、使わないでください。Wi-Fi提供者側で、接続端末同士が通信できないように設定されているはずです。

アプリを起動しているPC(Mac)のスリープやシャットダウンをためらう必要はありません。アプリが起動していなかった時間は、そばにいた時間とみなして次回アプリ起動時に加算します（ただし加算時間には上限があります）。

PC(Mac)の起動時にこのアプリが実行されるように設定すると、起動し忘れをなくせます。

ネットワーク上での認識にARPを使用している関係上、アプリを実行するPC(Mac)と同一のネットワークにスマートフォンが接続していない場合はアプリからスマートフォンを認識できません。

無線LANルータのプライバシーセパレータ・ネットワーク分離機能などと呼ばれる機能が有効な場合、スマートフォンとPC(Mac)が別のSSIDに接続していると両者が通信できません。プライバシーセパレータ・ネットワーク分離機能を無効にするか、両者を同一SSIDに接続してください。

スマートフォンをスリープしていても動作に支障はないはずですが、アプリ側に認識されない場合はスリープ解除すると認識されるかもしれません。

Wi-Fi通信が安定した環境での使用を推奨します。Wi-Fi通信が不安定な環境だと動作が不安定になります。

そばにいることをソフトウェア的に検知できなかった場合も、本当はそばにいたのにうまく検知できなかっただけと考えてやや甘めに判定しています。このネコはあなたがいないような気がしても、たいていはいると信じています。

このネコは構われるのもそんなに嫌いではないようです。

# 作者

OBATA Miki
* [Twitter](https://twitter.com/obatamiki)

# ライセンス

このソフトウェアは MIT ライセンスです。
This software is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).
